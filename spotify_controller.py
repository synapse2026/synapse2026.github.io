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

sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    redirect_uri=REDIRECT_URI,
    scope=SCOPE,
    cache_path=".cache-synapse-v17"
))

def run_synapse_dj():
    print(f"\n[{time.strftime('%H:%M:%S')}] --- Scanning Synapse HUD ---")
    try:
        response = requests.get(f"{SCRIPT_URL}?action=getTopSong")
        data = response.json()

        if data.get('uri') != "none" and data.get('votes', 0) > 0:
            song_uri = data['uri'].strip()
            song_name = data['name']
            
            # --- NEW: FETCH DURATION ---
            track_info = sp.track(song_uri)
            duration_sec = track_info['duration_ms'] / 1000
            print(f"🔥 CROWD WINNER: {song_name} ({data['votes']} votes) | Duration: {duration_sec}s")

            devices = sp.devices()
            active_device = next((d for d in devices['devices'] if d['is_active']), None)
            
            if not active_device:
                print("❌ ERROR: Spotify is idle. Play any song in Chrome first!")
                return

            # --- NEW: SIGNAL VOLUME REDUCTION ---
            # Tell dashboard to drop Hall of Fame volume to 20%
            requests.get(f"{SCRIPT_URL}?action=setMusicState&state=playing")

            try:
                requests.get(f"{SCRIPT_URL}?action=setMusicSignal")
                print("✨ SIGNAL: HUD Flash triggered!")
            except Exception as signal_err:
                print(f"⚠️ HUD Signal failed: {signal_err}")

            time.sleep(4) 

            # PLAYBACK
            print(f"🚀 Injecting {song_name} into Spotify...")
            sp.add_to_queue(song_uri)
            time.sleep(2) 
            sp.next_track()
            print(f"🎶 SUCCESS: Now playing {song_name}")

            # RESET VOTES
            requests.get(f"{SCRIPT_URL}?action=resetVotes&uri={song_uri}")
            
            # --- NEW: WAIT AND RESTORE ---
            # Keep dashboard volume low for the duration of the track
            print(f"⏳ Maintaining low dashboard volume for {duration_sec} seconds...")
            time.sleep(duration_sec)
            
            # Restore volume to 100%
            requests.get(f"{SCRIPT_URL}?action=setMusicState&state=idle")
            print("🔊 Dashboard volume restored to normal.")

        else:
            print("🧊 Status: No new votes. Vibe maintained.")

    except Exception as e:
        # Emergency restore of volume if script crashes
        requests.get(f"{SCRIPT_URL}?action=setMusicState&state=idle")
        print(f"🚨 System Error: {e}")

if __name__ == "__main__":
    print("🚀 SYNAPSE '26 ULTIMATE DJ ONLINE")
    while True:
        run_synapse_dj()
        print("\n⏲️ Cycle complete. Next check in 30 minutes...")
        time.sleep(1800)