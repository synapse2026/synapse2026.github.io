/**
 * SYNAPSE 2026 — Official High-Quality Vector Certificate Generator Engine
 * Govt. Residential Women's Polytechnic College, Payyanur
 * Client-Side instant PDF generation using jsPDF (0 email quota dependency)
 */

(function (global) {
    'use strict';

    const SynapseCertificates = {
        /**
         * Render a single certificate page onto a jsPDF instance
         * Page format: A4 Landscape (841.89 pt x 595.28 pt)
         */
        drawCertificate: function (doc, data) {
            const pageWidth = 841.89;
            const pageHeight = 595.28;
            const isWinner = (data.type === 'MERIT') || (data.rank && data.rank.trim() !== '');

            // Color Palette
            const primaryGold = [197, 155, 39];  // #c59b27
            const accentGold  = [230, 185, 60];  // #e6b93c
            const royalNavy   = [11, 26, 48];     // #0b1a30
            const softNavy    = [25, 45, 75];     // #192d4b
            const winnerRed   = [185, 35, 35];    // #b92323
            const slateDark   = [55, 60, 68];     // #373c44
            const softMuted   = [95, 100, 110];

            // 1. Base Canvas Background (Crisp Parchment/Pearl White)
            doc.setFillColor(254, 254, 252);
            doc.rect(0, 0, pageWidth, pageHeight, 'F');

            // 2. Outer Deep Royal Navy Border
            doc.setDrawColor(royalNavy[0], royalNavy[1], royalNavy[2]);
            doc.setLineWidth(4);
            doc.rect(20, 20, pageWidth - 40, pageHeight - 40);

            // 3. Inner Metallic Gold Decorative Border
            doc.setDrawColor(primaryGold[0], primaryGold[1], primaryGold[2]);
            doc.setLineWidth(1.6);
            doc.rect(26, 26, pageWidth - 52, pageHeight - 52);

            // 4. Subtle Inner Guide Line
            doc.setDrawColor(royalNavy[0], royalNavy[1], royalNavy[2]);
            doc.setLineWidth(0.5);
            doc.rect(30, 30, pageWidth - 60, pageHeight - 60);

            // 5. Ornate Tech-Corner Accents
            const corners = [
                [30, 30], [pageWidth - 30, 30],
                [30, pageHeight - 30], [pageWidth - 30, pageHeight - 30]
            ];
            doc.setFillColor(primaryGold[0], primaryGold[1], primaryGold[2]);
            corners.forEach(([cx, cy]) => {
                doc.rect(cx - 5, cy - 5, 10, 10, 'F');
                doc.setDrawColor(royalNavy[0], royalNavy[1], royalNavy[2]);
                doc.setLineWidth(1);
                doc.rect(cx - 8, cy - 8, 16, 16, 'D');
            });

            // 6. Header: College Details
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(15);
            doc.setTextColor(royalNavy[0], royalNavy[1], royalNavy[2]);
            doc.text("GOVERNMENT RESIDENTIAL WOMEN'S POLYTECHNIC COLLEGE", pageWidth / 2, 58, { align: 'center' });

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(softMuted[0], softMuted[1], softMuted[2]);
            doc.text("PAYYANUR, KANNUR DISTRICT, KERALA — 670307", pageWidth / 2, 71, { align: 'center' });

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(primaryGold[0], primaryGold[1], primaryGold[2]);
            doc.text("DEPARTMENT OF TECHNICAL EDUCATION • GOVERNMENT OF KERALA", pageWidth / 2, 83, { align: 'center' });

            // Decorative Divider Line
            doc.setDrawColor(primaryGold[0], primaryGold[1], primaryGold[2]);
            doc.setLineWidth(1);
            doc.line(140, 91, pageWidth - 140, 91);
            doc.circle(pageWidth / 2, 91, 3, 'F');
            doc.circle(pageWidth / 2 - 15, 91, 1.5, 'F');
            doc.circle(pageWidth / 2 + 15, 91, 1.5, 'F');

            // 7. Tech Fest Title
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(26);
            doc.setTextColor(royalNavy[0], royalNavy[1], royalNavy[2]);
            doc.text("S Y N A P S E   2 0 2 6", pageWidth / 2, 122, { align: 'center' });

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            doc.setTextColor(0, 128, 160);
            doc.text("STATE-LEVEL INTER-POLYTECHNIC TECHNICAL SYMPOSIUM", pageWidth / 2, 136, { align: 'center' });

            // 8. Certificate Category Badge
            const badgeY = 152;
            const badgeW = 300;
            const badgeH = 26;
            const badgeX = (pageWidth - badgeW) / 2;

            if (isWinner) {
                doc.setFillColor(primaryGold[0], primaryGold[1], primaryGold[2]);
                doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 4, 4, 'F');
                doc.setDrawColor(royalNavy[0], royalNavy[1], royalNavy[2]);
                doc.setLineWidth(0.8);
                doc.roundedRect(badgeX + 2, badgeY + 2, badgeW - 4, badgeH - 4, 3, 3, 'D');

                doc.setFont('helvetica', 'bold');
                doc.setFontSize(12);
                doc.setTextColor(255, 255, 255);
                doc.text("★  CERTIFICATE OF MERIT & EXCELLENCE  ★", pageWidth / 2, badgeY + 17, { align: 'center' });
            } else {
                doc.setFillColor(royalNavy[0], royalNavy[1], royalNavy[2]);
                doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 4, 4, 'F');
                doc.setDrawColor(primaryGold[0], primaryGold[1], primaryGold[2]);
                doc.setLineWidth(0.8);
                doc.roundedRect(badgeX + 2, badgeY + 2, badgeW - 4, badgeH - 4, 3, 3, 'D');

                doc.setFont('helvetica', 'bold');
                doc.setFontSize(12);
                doc.setTextColor(primaryGold[0], primaryGold[1], primaryGold[2]);
                doc.text("★  CERTIFICATE OF PARTICIPATION  ★", pageWidth / 2, badgeY + 17, { align: 'center' });
            }

            // 9. Citation Opening
            doc.setFont('times', 'italic');
            doc.setFontSize(13);
            doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
            doc.text("This is to proudly certify that", pageWidth / 2, 208, { align: 'center' });

            // 10. Participant Name (Prominent & Elegant)
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(22);
            doc.setTextColor(royalNavy[0], royalNavy[1], royalNavy[2]);
            const rawName = (data.name || "PARTICIPANT NAME").trim();
            const studentName = rawName.toUpperCase();
            doc.text(studentName, pageWidth / 2, 236, { align: 'center' });

            // Gold underline under student name
            const textW = Math.min(doc.getTextWidth(studentName) + 36, 520);
            doc.setDrawColor(primaryGold[0], primaryGold[1], primaryGold[2]);
            doc.setLineWidth(1.2);
            doc.line((pageWidth - textW) / 2, 242, (pageWidth + textW) / 2, 242);

            // 11. Institution & Academic Details
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12);
            doc.setTextColor(50, 55, 65);
            let collegeStr = (data.college || "Polytechnic College").trim();
            let deptStr = (data.dept && data.dept !== "Others") ? `, Dept of ${data.dept}` : "";
            let semStr = data.sem ? ` (${data.sem})` : "";
            const instLine = `of ${collegeStr}${deptStr}${semStr}`;
            doc.text(instLine, pageWidth / 2, 267, { align: 'center' });

            // 12. Achievement Statement & Event Info
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12);
            if (isWinner) {
                doc.text("has successfully competed and secured", pageWidth / 2, 296, { align: 'center' });

                // Winner Rank Highlight
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(17);
                doc.setTextColor(winnerRed[0], winnerRed[1], winnerRed[2]);
                doc.text((data.rank || "WINNER").toUpperCase(), pageWidth / 2, 321, { align: 'center' });

                doc.setFont('helvetica', 'normal');
                doc.setFontSize(12);
                doc.setTextColor(50, 55, 65);
                doc.text("in the state-level competition", pageWidth / 2, 342, { align: 'center' });
            } else {
                doc.text("has actively participated in the state-level technical competition", pageWidth / 2, 305, { align: 'center' });
            }

            // 13. Event Name
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(19);
            doc.setTextColor(royalNavy[0], royalNavy[1], royalNavy[2]);
            const eventNameText = `"${(data.eventName || 'TECHNICAL EVENT').trim().toUpperCase()}"`;
            const eventY = isWinner ? 368 : 335;
            doc.text(eventNameText, pageWidth / 2, eventY, { align: 'center' });

            // 14. Fest Date & Venue Concluding Line
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10.5);
            doc.setTextColor(softMuted[0], softMuted[1], softMuted[2]);
            const dateLineY = isWinner ? 398 : 368;
            doc.text("held as part of SYNAPSE 2026 on 25th & 26th November 2026", pageWidth / 2, dateLineY, { align: 'center' });
            doc.text("at Govt. Residential Women's Polytechnic College, Payyanur, Kannur, Kerala.", pageWidth / 2, dateLineY + 15, { align: 'center' });

            // 15. Center Gold Rosette / Medallion Seal
            const sealX = pageWidth / 2;
            const sealY = 482;
            doc.setDrawColor(primaryGold[0], primaryGold[1], primaryGold[2]);
            doc.setLineWidth(1.6);
            doc.circle(sealX, sealY, 26, 'D');
            doc.setLineWidth(0.6);
            doc.circle(sealX, sealY, 22, 'D');

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(5.5);
            doc.setTextColor(primaryGold[0], primaryGold[1], primaryGold[2]);
            doc.text("GOVT. RESIDENTIAL WOMEN'S", sealX, sealY - 10, { align: 'center' });
            doc.setFontSize(5);
            doc.text("POLYTECHNIC COLLEGE", sealX, sealY - 4, { align: 'center' });
            doc.setFontSize(7.5);
            doc.setTextColor(royalNavy[0], royalNavy[1], royalNavy[2]);
            doc.text("★ PAYYANUR ★", sealX, sealY + 4, { align: 'center' });
            doc.setFontSize(5);
            doc.setTextColor(primaryGold[0], primaryGold[1], primaryGold[2]);
            doc.text("SYNAPSE 2026", sealX, sealY + 11, { align: 'center' });

            // 16. Signatures (Left: Staff Coordinator, Right: Principal)
            const sigLineY = 496;

            // Staff Coordinator Signature Line
            doc.setDrawColor(royalNavy[0], royalNavy[1], royalNavy[2]);
            doc.setLineWidth(1);
            doc.line(75, sigLineY, 225, sigLineY);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(royalNavy[0], royalNavy[1], royalNavy[2]);
            doc.text("Staff Coordinator", 150, sigLineY + 14, { align: 'center' });
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(softMuted[0], softMuted[1], softMuted[2]);
            doc.text("SYNAPSE 2026", 150, sigLineY + 25, { align: 'center' });

            // Principal Signature Line
            doc.setDrawColor(royalNavy[0], royalNavy[1], royalNavy[2]);
            doc.setLineWidth(1);
            doc.line(pageWidth - 225, sigLineY, pageWidth - 75, sigLineY);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.setTextColor(royalNavy[0], royalNavy[1], royalNavy[2]);
            doc.text("Principal", pageWidth - 150, sigLineY + 14, { align: 'center' });
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(softMuted[0], softMuted[1], softMuted[2]);
            doc.text("GRWPC Payyanur", pageWidth - 150, sigLineY + 25, { align: 'center' });

            // 17. Security & Digital Verification Footer
            const cleanMobile = String(data.mobile || "0000").replace(/\D/g, '').slice(-4) || "0000";
            const hashSalt = Math.abs((data.name || "").split("").reduce((acc, c) => ((acc << 5) - acc) + c.charCodeAt(0), 0) % 9000) + 1000;
            const certId = data.certId || `SYN26-${isWinner ? 'WIN' : 'PRT'}-${cleanMobile}-${hashSalt}`;

            doc.setFont('courier', 'bold');
            doc.setFontSize(7.5);
            doc.setTextColor(100, 105, 115);
            doc.text(`VERIFICATION ID: ${certId}`, 45, pageHeight - 38);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7.5);
            doc.text("Verify Credential: https://synapse2026.github.io/events.html", pageWidth - 45, pageHeight - 38, { align: 'right' });
        },

        getJsPDFClass: function () {
            if (typeof window !== 'undefined') {
                if (window.jspdf && window.jspdf.jsPDF) return window.jspdf.jsPDF;
                if (window.jsPDF) return window.jsPDF;
            }
            if (typeof global !== 'undefined') {
                if (global.jspdf && global.jspdf.jsPDF) return global.jspdf.jsPDF;
                if (global.jsPDF) return global.jsPDF;
            }
            if (typeof jsPDF !== 'undefined') return jsPDF;
            return null;
        },

        /**
         * Create a new standalone jsPDF instance for a single certificate
         */
        createPDF: function (certData) {
            const jsPDFClass = this.getJsPDFClass();
            if (!jsPDFClass) {
                throw new Error("jsPDF library not loaded");
            }
            const doc = new jsPDFClass({
                orientation: 'landscape',
                unit: 'pt',
                format: 'a4'
            });
            this.drawCertificate(doc, certData);
            return doc;
        },

        /**
         * Download a single certificate directly in browser
         */
        downloadSingleCertificate: function (certData) {
            const doc = this.createPDF(certData);
            const safeName = (certData.name || 'Participant').replace(/[^a-zA-Z0-9]/g, '_');
            const safeEvent = (certData.eventName || 'Event').replace(/[^a-zA-Z0-9]/g, '_');
            const typeStr = certData.type === 'MERIT' ? 'Merit' : 'Participation';
            const filename = `SYNAPSE_2026_${typeStr}_${safeName}_${safeEvent}.pdf`;
            doc.save(filename);
            return filename;
        },

        /**
         * Batch download a multi-page PDF containing all provided certificates
         */
        downloadMultiPagePDF: function (certList, batchFilename) {
            if (!batchFilename) batchFilename = 'SYNAPSE_2026_All_Certificates.pdf';
            if (!certList || certList.length === 0) {
                alert("No certificates to download!");
                return;
            }
            const jsPDFClass = this.getJsPDFClass();
            if (!jsPDFClass) throw new Error("jsPDF library not loaded");

            const doc = new jsPDFClass({
                orientation: 'landscape',
                unit: 'pt',
                format: 'a4'
            });

            certList.forEach((cert, idx) => {
                if (idx > 0) doc.addPage('a4', 'landscape');
                this.drawCertificate(doc, cert);
            });

            doc.save(batchFilename);
        },

        /**
         * Extract individual certificates from a student record
         */
        extractCertificates: function (p) {
            const certs = {
                merit: [],
                participation: [],
                registeredOnly: []
            };

            if (!p) return certs;

            // 1. Check Winners (Merit)
            const pWinner = p.winner ? String(p.winner).trim() : "";
            if (pWinner) {
                pWinner.split('|').forEach(wStr => {
                    const trimmed = wStr.trim();
                    if (!trimmed) return;
                    const parts = trimmed.split(':');
                    const eventName = parts[0].trim();
                    const rank = parts.length > 1 ? parts.slice(1).join(':').trim() : "Winner";
                    certs.merit.push({
                        name: p.name,
                        mobile: p.mobile,
                        college: p.college,
                        dept: p.dept,
                        sem: p.sem,
                        eventName: eventName,
                        rank: rank,
                        type: 'MERIT'
                    });
                });
            }

            // 2. Check Attendance (Participation)
            const pAttendance = p.attendance ? String(p.attendance).trim() : "";
            if (pAttendance && pAttendance !== "ABSENT") {
                pAttendance.split('|').forEach(aStr => {
                    const trimmed = aStr.trim();
                    if (!trimmed || trimmed === "ABSENT") return;
                    const parts = trimmed.split(':');
                    const eventName = parts[0].trim();
                    const status = parts.length > 1 ? parts.slice(1).join(':').trim() : "PRESENT";
                    if (status.toUpperCase().includes("PRESENT")) {
                        certs.participation.push({
                            name: p.name,
                            mobile: p.mobile,
                            college: p.college,
                            dept: p.dept,
                            sem: p.sem,
                            eventName: eventName,
                            rank: "",
                            type: 'PARTICIPATION'
                        });
                    }
                });
            }

            // 3. Registered Events (if not yet marked present/winner)
            const pEvents = p.events ? String(p.events).trim() : "";
            if (pEvents) {
                pEvents.split(',').forEach(eStr => {
                    const evt = eStr.trim();
                    if (!evt) return;
                    // Check if already covered by merit or participation
                    const hasMerit = certs.merit.some(m => m.eventName.toLowerCase() === evt.toLowerCase());
                    const hasPart = certs.participation.some(pt => pt.eventName.toLowerCase() === evt.toLowerCase());
                    if (!hasMerit && !hasPart) {
                        certs.registeredOnly.push(evt);
                    }
                });
            }

            return certs;
        },

        /**
         * Extract all certificates from masterData array
         */
        extractAllCertificates: function (masterData) {
            let all = [];
            masterData.forEach(p => {
                const res = this.extractCertificates(p);
                res.merit.forEach(m => all.push(m));
                res.participation.forEach(pt => all.push(pt));
            });
            return all;
        }
    };

    // Export to global window or Node module
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = SynapseCertificates;
    } else {
        global.SynapseCertificates = SynapseCertificates;
    }

})(typeof window !== 'undefined' ? window : this);
