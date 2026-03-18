import spotipy
from spotipy.oauth2 import SpotifyOAuth
import requests
import time

# --- 1. CONFIGURATION ---
CLIENT_ID = '761345730d854928aa3a6f18428424da'
CLIENT_SECRET = '13a1f3b900ee4815a8a6da65e35fe3c7'
REDIRECT_URI = 'http://127.0.0.1:8888/callback'
SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzb97bG3GTT1wMH7M9j8RDXkoqoFD_MWXFkUZS0przdUO51s-7Zyutn0FbRSRnjjH8X5A/exec" 

SCOPE = "user-modify-playback-state user-read-playback-state"

# Global tracking
song_end_timestamp = 0 

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    redirect_uri=REDIRECT_URI,
    scope=SCOPE,
    cache_path=".cache-synapse-v17"
))

def get_remaining_time():
    if song_end_timestamp == 0:
        return "No song active."
    rem = song_end_timestamp - time.time()
    if rem <= 0:
        return "Finishing..."
    return f"{int(rem // 60)}m {int(rem % 60)}s left"

def check_and_restore_volume():
    global song_end_timestamp
    if song_end_timestamp > 0 and time.time() >= song_end_timestamp:
        try:
            # We use a timeout=10 here to prevent the script from hanging forever
            requests.get(f"{SCRIPT_URL}?action=setMusicState&state=idle", timeout=10)
            print("🔊 [AUTO-RESTORE] Song finished. Volume restored.")
            song_end_timestamp = 0 
        except Exception:
            print("⚠️ Volume restore failed (Network), will retry next loop.")

def run_synapse_dj():
    global song_end_timestamp
    check_and_restore_volume()

    print(f"\n[{time.strftime('%H:%M:%S')}] --- Scanning Synapse HUD ---")
    print(f"🕒 Status: {get_remaining_time()}")
    
    try:
        # Added timeout to prevent the 'RemoteDisconnected' crash
        response = requests.get(f"{SCRIPT_URL}?action=getTopSong", timeout=15)
        data = response.json()

        if data.get('uri') != "none" and data.get('votes', 0) > 0:
            song_uri = data['uri'].strip()
            song_name = data['name']
            
            track_info = sp.track(song_uri)
            duration_sec = track_info['duration_ms'] / 1000
            
            print(f"🔥 CROWD WINNER: {song_name} ({data['votes']} votes)")

            devices = sp.devices()
            active_device = next((d for d in devices['devices'] if d['is_active']), None)
            
            if not active_device:
                print("❌ ERROR: No active Spotify device found!")
                return

            # Trigger volume and signal
            requests.get(f"{SCRIPT_URL}?action=setMusicState&state=playing", timeout=10)
            requests.get(f"{SCRIPT_URL}?action=setMusicSignal", timeout=10)

            time.sleep(2) 

            # Playback logic
            sp.add_to_queue(song_uri)
            time.sleep(1) 
            sp.next_track()
            
            # Reset votes on dashboard
            requests.get(f"{SCRIPT_URL}?action=resetVotes&uri={song_uri}", timeout=10)
            
            song_end_timestamp = time.time() + duration_sec
            print(f"🎶 NOW PLAYING: {song_name}")
            print(f"⏳ Ends at: {time.strftime('%H:%M:%S', time.localtime(song_end_timestamp))}")

        else:
            print("🧊 Status: No new votes.")

    except requests.exceptions.RequestException as net_err:
        print(f"📡 Network Hiccup: {net_err}. Retrying in 5 mins...")
    except Exception as e:
        print(f"🚨 System Error: {e}")

if __name__ == "__main__":
    print("🚀 SYNAPSE '26 ULTIMATE DJ ONLINE")
    while True:
        try:
            run_synapse_dj()
        except Exception as main_err:
            print(f"⚠️ Critical Loop Error: {main_err}")
            
        print("\n⏲️ Cycle complete. Next check in 5 minutes...")
        time.sleep(300)
