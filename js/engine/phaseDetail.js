// PhaseDetail Engine — draws phase-specific visual overlays on the canvas
class PhaseDetailEngine {
    constructor() {
        this.time = 0;
        this.sparks = [];
        this.ripples = [];
        this.flow = Array.from({length: 15}, (_, i) => ({
            t: Math.random(), path: i % 8, speed: 0.0008 + Math.random() * 0.0006
        }));
    }

    update(dt) {
        this.time += dt / 1000;
        const phase = window.AppInstance ? window.AppInstance.currentPhase : 0;

        // Sparks for forge (phase 6)
        if (phase === 6) {
            if (Math.random() < 0.35) {
                const fp = Projection.project(180, CONFIG.DEPTHS.LEVEL_1, 60);
                for (let i = 0; i < 3; i++) this.sparks.push({
                    x: fp.x + (Math.random()-0.5)*15, y: fp.y - 5,
                    vx: (Math.random()-0.5)*5, vy: -Math.random()*4 - 1,
                    life: 1.0, col: Math.random() > 0.5 ? '#ffb300' : '#ff6d00'
                });
            }
        }
        this.sparks = this.sparks.filter(s => s.life > 0);
        this.sparks.forEach(s => { s.x += s.vx; s.y += s.vy; s.vy += 0.4; s.life -= 0.06; });

        // Ripples for river (phase 9)
        if (phase === 9 && Math.random() < 0.06) {
            const rp = Projection.project(500, CONFIG.DEPTHS.LEVEL_3, 200);
            this.ripples.push({ x: rp.x + (Math.random()-0.5)*60, y: rp.y + (Math.random()-0.5)*20, r: 4, life: 1 });
        }
        this.ripples = this.ripples.filter(r => r.life > 0);
        this.ripples.forEach(r => { r.r += 2; r.life -= 0.025; });

        this.flow.forEach(f => { f.t += f.speed; if (f.t > 1) f.t = 0; });
    }

    render() {
        if (!window.AppInstance) return;
        const phase = window.AppInstance.currentPhase;
        const ctx = Canvas.ctx, t = this.time, z = CONFIG.CAMERA.zoom;
        const lmap = {};
        LOCATIONS.forEach(l => lmap[l.id] = l);
        const proj = (id) => { const l = lmap[id]; return l ? Projection.project(l.x, l.y, l.z) : null; };

        switch (phase) {
            case 0: this._overview(ctx, t, z); break;
            case 1: this._entrance(ctx, t, z, proj, lmap); break;
            case 2: this._tunnels(ctx, t, z, lmap); break;
            case 3: this._kitchen(ctx, t, z, proj); break;
            case 4: this._meeting(ctx, t, z, proj); break;
            case 5: this._medical(ctx, t, z, proj); break;
            case 6: this._forge(ctx, t, z, proj); break;
            case 7: this._traps(ctx, t, z, proj); break;
            case 8: this._airvent(ctx, t, z, proj); break;
            case 9: this._river(ctx, t, z, proj); break;
            case 10: this._compare(ctx, t, z); break;
            case 11: this._warzone(ctx, t, z); break;
        }
    }

    _pulse(ctx, wx, wy, wz, col, t, speed=1) {
        const p = Projection.project(wx, wy, wz), z = CONFIG.CAMERA.zoom;
        for (let i = 0; i < 3; i++) {
            const ph = ((t * speed + i/3) % 1);
            ctx.save();
            ctx.globalAlpha = (1-ph) * 0.6;
            ctx.strokeStyle = col; ctx.lineWidth = 2.5 * z;
            ctx.beginPath(); ctx.arc(p.x, p.y, (20 + ph * 70) * z, 0, Math.PI*2); ctx.stroke();
            ctx.restore();
        }
    }

    _label(ctx, x, y, text, col, z, size=12) {
        ctx.save(); ctx.font = `bold ${size*Math.min(z,2)}px Inter`;
        ctx.fillStyle = col; ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 6;
        ctx.fillText(text, x, y); ctx.restore();
    }

    _overview(ctx, t, z) {
        const depths = [
            { y: CONFIG.DEPTHS.SURFACE, lbl: '0m — Mặt đất', col: '#7ecf7e' },
            { y: CONFIG.DEPTHS.LEVEL_1, lbl: '3m — Tầng 1', col: '#ffd60a' },
            { y: CONFIG.DEPTHS.LEVEL_2, lbl: '6m — Tầng 2', col: '#ff9800' },
            { y: CONFIG.DEPTHS.LEVEL_3, lbl: '10m — Tầng 3', col: '#ff5722' },
        ];
        for (const d of depths) {
            const l = Projection.project(-800, d.y, 0), r = Projection.project(800, d.y, 0);
            ctx.save(); ctx.setLineDash([10, 6]); ctx.strokeStyle = d.col;
            ctx.globalAlpha = 0.35; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(l.x, l.y); ctx.lineTo(r.x, r.y); ctx.stroke();
            ctx.restore();
            this._label(ctx, l.x + 80, l.y - 8, '▶ ' + d.lbl, d.col, z, 12);
        }
        // Glow all nodes
        for (const n of LOCATIONS) {
            const p = Projection.project(n.x, n.y, n.z);
            const col = n.type === 'trap' ? '#ff4444' : n.type === 'entrance' ? '#44ff88' : '#ffd60a';
            const pulse = Math.sin(t * 2 + n.x * 0.01) * 0.2 + 0.6;
            ctx.save(); ctx.globalAlpha = pulse * 0.2; ctx.fillStyle = col;
            ctx.beginPath(); ctx.arc(p.x, p.y, 55 * z * pulse, 0, Math.PI*2); ctx.fill(); ctx.restore();
        }
        this._label(ctx, CONFIG.CANVAS_WIDTH/2, 55, '🗺  250km hầm ngầm  •  3 tầng  •  10,000+ chiến sĩ', '#ffd60a', Math.min(z,1), 15);
    }

    _entrance(ctx, t, z, proj, lmap) {
        // Pulse rings on all entrances
        ['lo_xuong_1','lo_thong_hoi','ngach_song'].forEach(id => {
            const l = lmap[id]; if (!l) return;
            this._pulse(ctx, l.x, l.y, l.z, '#00ff88', t, 0.8);
        });
        // Draw detailed trapdoor at main entrance
        const m = Projection.project(-420, CONFIG.DEPTHS.SURFACE, 80);
        ctx.save(); ctx.translate(m.x, m.y);
        const dw = 26*z, dh = 17*z;
        ctx.fillStyle = '#6b4226'; ctx.strokeStyle = '#3d1f0a'; ctx.lineWidth = 2*z;
        ctx.fillRect(-dw,-dh,dw*2,dh*2); ctx.strokeRect(-dw,-dh,dw*2,dh*2);
        ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 1;
        for (let i = -dw+8; i < dw; i += 8) { ctx.beginPath(); ctx.moveTo(i,-dh); ctx.lineTo(i,dh); ctx.stroke(); }
        ctx.fillStyle = '#888'; ctx.beginPath(); ctx.arc(0, 0, 4*z, 0, Math.PI*2); ctx.fill();
        ctx.restore();
        // Bouncing arrow
        const bounce = Math.sin(t*3)*8;
        ctx.save(); ctx.globalAlpha = 0.9; ctx.fillStyle = '#00ff88';
        ctx.font = `${28*z}px serif`; ctx.textAlign = 'center';
        ctx.shadowColor = '#00ff88'; ctx.shadowBlur = 12;
        ctx.fillText('↓', m.x, m.y - 50*z + bounce); ctx.restore();
        this._label(ctx, m.x, m.y + 58*z, '30 × 45cm — Nắp gỗ ngụy trang', '#00ff88', z, 11);
        // Dashed path to kitchen
        const k = Projection.project(-280, CONFIG.DEPTHS.LEVEL_1, 100);
        ctx.save(); ctx.setLineDash([7,5]); ctx.strokeStyle = 'rgba(0,255,136,0.45)'; ctx.lineWidth = 2*z;
        ctx.beginPath(); ctx.moveTo(m.x,m.y); ctx.lineTo(k.x,k.y); ctx.stroke(); ctx.restore();
    }

    _tunnels(ctx, t, z, lmap) {
        const paths = [
            ['lo_xuong_1','bep_hoang_cam'],['bep_hoang_cam','phong_hop'],
            ['phong_hop','ham_chi_huy'],['ham_chi_huy','benh_xa'],
            ['ham_chi_huy','noi_tru_an_b52'],['noi_tru_an_b52','gieng_nuoc'],
            ['gieng_nuoc','ngach_song'],['xuong_vu_khi','ham_chi_huy']
        ];
        // Glowing tunnel highlight lines
        for (const [a, b] of paths) {
            const la = lmap[a], lb = lmap[b]; if (!la||!lb) continue;
            const p1 = Projection.project(la.x,la.y,la.z), p2 = Projection.project(lb.x,lb.y,lb.z);
            ctx.save(); ctx.strokeStyle = 'rgba(255,180,40,0.55)'; ctx.lineWidth = 7*z;
            ctx.shadowColor = '#ffa000'; ctx.shadowBlur = 10;
            ctx.beginPath(); ctx.moveTo(p1.x,p1.y); ctx.lineTo(p2.x,p2.y); ctx.stroke(); ctx.restore();
        }
        // Animated flow dots
        for (const fp of this.flow) {
            const [a,b] = paths[fp.path % paths.length];
            const la = lmap[a], lb = lmap[b]; if (!la||!lb) continue;
            const p1 = Projection.project(la.x,la.y,la.z), p2 = Projection.project(lb.x,lb.y,lb.z);
            const px = p1.x+(p2.x-p1.x)*fp.t, py = p1.y+(p2.y-p1.y)*fp.t;
            ctx.save(); ctx.globalAlpha = 0.9; ctx.fillStyle = '#ffe066';
            ctx.shadowColor = '#ffaa00'; ctx.shadowBlur = 8;
            ctx.beginPath(); ctx.arc(px,py,4.5*z,0,Math.PI*2); ctx.fill(); ctx.restore();
        }
        this._label(ctx, CONFIG.CANVAS_WIDTH/2, 55, '⚡ Mạng lưới hầm kết nối — Chiều rộng: 0.8–1.2m', '#ffd60a', Math.min(z,1), 13);
    }

    _kitchen(ctx, t, z, proj) {
        const k = proj('bep_hoang_cam'), v = proj('lo_thong_hoi'); if (!k) return;
        // Zigzag smoke channel
        const cpts = [
            Projection.project(-280, CONFIG.DEPTHS.LEVEL_1, 100),
            Projection.project(-262, CONFIG.DEPTHS.LEVEL_1+60, 112),
            Projection.project(-248, CONFIG.DEPTHS.LEVEL_1+120, 116),
            Projection.project(-236, CONFIG.DEPTHS.LEVEL_1+180, 119),
            Projection.project(-225, CONFIG.DEPTHS.SURFACE-20, 120),
        ];
        ctx.save(); ctx.strokeStyle = 'rgba(160,90,30,0.75)'; ctx.lineWidth = 3.5*z; ctx.setLineDash([5,3]);
        ctx.beginPath(); ctx.moveTo(cpts[0].x,cpts[0].y);
        for (let i=1;i<cpts.length;i++) ctx.lineTo(cpts[i].x,cpts[i].y);
        ctx.stroke(); ctx.restore();
        // Smoke wisps
        for (let i=0;i<4;i++) {
            const st=((t*0.18+i*0.25)%1), idx=Math.min(Math.floor(st*(cpts.length-1)),cpts.length-2);
            const fr=(st*(cpts.length-1))%1;
            const sx=cpts[idx].x+(cpts[idx+1].x-cpts[idx].x)*fr, sy=cpts[idx].y+(cpts[idx+1].y-cpts[idx].y)*fr;
            ctx.save(); ctx.globalAlpha=0.28; ctx.fillStyle='#c0b090';
            ctx.beginPath(); ctx.arc(sx+Math.sin(t*3+i)*6,sy,9*z,0,Math.PI*2); ctx.fill(); ctx.restore();
        }
        // Flame at kitchen
        ctx.save(); ctx.translate(k.x, k.y);
        const fh=(18+Math.sin(t*8)*5)*z, fw=(10+Math.cos(t*6)*2)*z;
        const fg=ctx.createRadialGradient(0,0,0,0,-fh*.6,fh);
        fg.addColorStop(0,'rgba(255,210,0,0.9)'); fg.addColorStop(0.5,'rgba(255,90,0,0.65)'); fg.addColorStop(1,'rgba(255,0,0,0)');
        ctx.fillStyle=fg; ctx.beginPath(); ctx.ellipse(0,-fh*.3,fw,fh,0,0,Math.PI*2); ctx.fill(); ctx.restore();
        this._label(ctx, k.x, k.y-72*z, '🔥 Khói dẫn qua 4 rãnh ngầm (8–10m)', '#ffb347', z, 11);
        if (v) this._label(ctx, v.x, v.y-38*z, '↑ Thoát ra lỗ thông hơi', '#c0b090', z, 10);
    }

    _meeting(ctx, t, z, proj) {
        const r = proj('phong_hop'); if (!r) return;
        ctx.save(); ctx.translate(r.x, r.y);
        // Table
        const tw=65*z, th=17*z;
        ctx.fillStyle='#5a3520'; ctx.strokeStyle='#3a2010'; ctx.lineWidth=1.5*z;
        ctx.fillRect(-tw,-th*.5,tw*2,th); ctx.strokeRect(-tw,-th*.5,tw*2,th);
        // Oil lamp glow
        const lf=Math.sin(t*7)*.12+0.88, lr=(10+Math.sin(t*9)*2)*z*lf;
        const lg=ctx.createRadialGradient(0,-4*z,0,0,-4*z,lr*4);
        lg.addColorStop(0,`rgba(255,220,100,${0.85*lf})`); lg.addColorStop(0.4,`rgba(255,150,30,${0.45*lf})`); lg.addColorStop(1,'rgba(255,80,0,0)');
        ctx.fillStyle=lg; ctx.beginPath(); ctx.arc(0,-4*z,lr*4,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#8b7355'; ctx.beginPath(); ctx.ellipse(0,-2*z,5*z,3*z,0,0,Math.PI*2); ctx.fill();
        // Silhouette people
        for (const sx of [-55,-28,0,28,55]) {
            ctx.fillStyle='rgba(15,8,4,0.85)';
            ctx.beginPath(); ctx.ellipse(sx*z,22*z,6*z,9*z,0,0,Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(sx*z,10*z,5*z,0,Math.PI*2); ctx.fill();
        }
        ctx.restore();
        this._label(ctx, r.x, r.y-82*z, '📋 Họp mặt trận — 15 người — 30°C', '#ffd60a', z, 11);
    }

    _medical(ctx, t, z, proj) {
        const r = proj('benh_xa'); if (!r) return;
        ctx.save(); ctx.translate(r.x, r.y);
        // Surgical table
        const tw=62*z, th=18*z;
        ctx.fillStyle='#7a5c3a'; ctx.strokeStyle='#4a3020'; ctx.lineWidth=1.5*z;
        ctx.fillRect(-tw,-th*.5,tw*2,th); ctx.strokeRect(-tw,-th*.5,tw*2,th);
        for (const lx of [-tw*.65,tw*.65]) {
            ctx.strokeStyle='#4a3020'; ctx.lineWidth=2.5*z;
            ctx.beginPath(); ctx.moveTo(lx,th*.5); ctx.lineTo(lx,th*2); ctx.stroke();
        }
        // Spotlight (medical lamp)
        const sg=ctx.createRadialGradient(0,-30*z,0,0,0,55*z);
        sg.addColorStop(0,'rgba(220,240,255,0.55)'); sg.addColorStop(0.5,'rgba(200,220,255,0.2)'); sg.addColorStop(1,'rgba(200,220,255,0)');
        ctx.fillStyle=sg; ctx.beginPath(); ctx.arc(0,0,55*z,0,Math.PI*2); ctx.fill();
        // Red cross
        ctx.fillStyle='rgba(220,40,40,0.75)';
        ctx.fillRect(-3*z,-14*z,6*z,28*z); ctx.fillRect(-14*z,-3*z,28*z,6*z);
        // Patient silhouette on table
        ctx.fillStyle='rgba(20,10,5,0.75)';
        ctx.beginPath(); ctx.ellipse(-10*z,-1*z,30*z,7*z,0.1,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(22*z,-1*z,7*z,0,Math.PI*2); ctx.fill();
        ctx.restore();
        this._label(ctx, r.x, r.y-82*z, '🏥 Bệnh xá — Phẫu thuật không gây mê', '#ff8888', z, 11);
    }
    _forge(ctx, t, z, proj) {
        const r = proj('xuong_vu_khi'); if (!r) return;
        ctx.save(); ctx.translate(r.x, r.y);
        // Anvil block
        ctx.fillStyle='#555'; ctx.fillRect(-18*z, 2*z, 36*z, 12*z);
        ctx.fillRect(-12*z, -6*z, 24*z, 8*z);
        // Hammer
        const hangle = Math.sin(t*4)*0.4;
        ctx.save(); ctx.rotate(hangle); ctx.fillStyle='#8b8b8b';
        ctx.fillRect(-4*z,-28*z,8*z,22*z); ctx.fillRect(-10*z,-32*z,20*z,10*z); ctx.restore();
        // Crates of ammo
        for (const [cx2,cy2] of [[-50,-8],[50,-8],[-50,10],[50,10]]) {
            ctx.fillStyle='#5a3a1a'; ctx.strokeStyle='#3a2010'; ctx.lineWidth=1*z;
            ctx.fillRect(cx2*z,cy2*z,20*z,14*z); ctx.strokeRect(cx2*z,cy2*z,20*z,14*z);
        }
        // Orange glow from forge
        const fg=ctx.createRadialGradient(0,0,0,0,0,50*z);
        fg.addColorStop(0,`rgba(255,120,0,${0.4+Math.sin(t*6)*.1})`); fg.addColorStop(1,'rgba(255,60,0,0)');
        ctx.fillStyle=fg; ctx.beginPath(); ctx.arc(0,0,50*z,0,Math.PI*2); ctx.fill();
        ctx.restore();
        // Sparks
        for (const s of this.sparks) {
            ctx.save(); ctx.globalAlpha=s.life*0.9; ctx.fillStyle=s.col;
            ctx.beginPath(); ctx.arc(s.x,s.y,2.5*z,0,Math.PI*2); ctx.fill(); ctx.restore();
        }
        this._label(ctx, r.x, r.y-78*z, '⚒ Xưởng rèn — Tái chế bom mìn địch', '#ff9800', z, 11);
    }

    _traps(ctx, t, z, proj) {
        const r = proj('ham_chong'); if (!r) return;
        ctx.save(); ctx.translate(r.x, r.y);
        // Pit outline
        const pw=55*z, ph=50*z;
        ctx.fillStyle='rgba(0,0,0,0.8)'; ctx.strokeStyle='rgba(255,60,60,0.8)'; ctx.lineWidth=2.5*z;
        ctx.fillRect(-pw,-ph*.3,pw*2,ph); ctx.strokeRect(-pw,-ph*.3,pw*2,ph);
        // Spikes inside pit
        ctx.strokeStyle='#cc3322'; ctx.lineWidth=1.5*z;
        for (let i=-4;i<=4;i++) {
            const sx=i*11*z;
            ctx.beginPath(); ctx.moveTo(sx, ph*.6); ctx.lineTo(sx-5*z, ph*.55); ctx.lineTo(sx+5*z, ph*.55); ctx.closePath();
            ctx.fillStyle='#aa2211'; ctx.fill(); ctx.stroke();
        }
        // Warning skull blink
        const blink=Math.sin(t*4)>0;
        if (blink) {
            ctx.font=`${26*z}px serif`; ctx.textAlign='center';
            ctx.shadowColor='#ff0000'; ctx.shadowBlur=12;
            ctx.fillStyle='#ff4444'; ctx.fillText('☠', 0, -60*z);
        }
        ctx.restore();
        this._label(ctx, r.x, r.y-90*z, '⚠ Hầm chông — 30-50cm nhọn tẩm độc', '#ff4444', z, 11);
        // Pulse danger ring
        this._pulse(ctx, 50, CONFIG.DEPTHS.LEVEL_1, 0, '#ff4444', t, 1.2);
    }

    _airvent(ctx, t, z, proj) {
        const v = proj('lo_thong_hoi'), k = proj('bep_hoang_cam'); if (!v) return;
        // Termite mound at surface
        ctx.save(); ctx.translate(v.x, v.y);
        const mh=35*z, mw=22*z;
        const mg=ctx.createLinearGradient(0,0,0,-mh);
        mg.addColorStop(0,'#8b6914'); mg.addColorStop(1,'#c49a3c');
        ctx.fillStyle=mg; ctx.beginPath();
        ctx.ellipse(0,0,mw,mh*.4,0,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-mw,0); ctx.lineTo(0,-mh); ctx.lineTo(mw,0); ctx.closePath();
        ctx.fillStyle='#a07828'; ctx.fill();
        // Texture lines on mound
        ctx.strokeStyle='rgba(0,0,0,0.2)'; ctx.lineWidth=1*z;
        for (let i=1;i<4;i++) {
            const ly=-mh*(i/4), lw=mw*(1-i/4)*0.9;
            ctx.beginPath(); ctx.moveTo(-lw,ly); ctx.lineTo(lw,ly); ctx.stroke();
        }
        ctx.restore();
        // Wavy air wisps rising
        for (let i=0;i<3;i++) {
            const wt=((t*0.35+i*0.33)%1);
            const wx2=v.x+Math.sin(t*2+i)*12*z, wy2=v.y-(wt*60+15)*z;
            ctx.save(); ctx.globalAlpha=(1-wt)*0.35; ctx.fillStyle='rgba(200,220,200,0.8)';
            ctx.beginPath(); ctx.arc(wx2,wy2,5*z,0,Math.PI*2); ctx.fill(); ctx.restore();
        }
        // Dashed pipe to kitchen
        if (k) {
            ctx.save(); ctx.setLineDash([5,4]); ctx.strokeStyle='rgba(180,140,60,0.5)'; ctx.lineWidth=2.5*z;
            ctx.beginPath(); ctx.moveTo(v.x,v.y); ctx.lineTo(k.x,k.y); ctx.stroke(); ctx.restore();
        }
        this._label(ctx, v.x, v.y-70*z, '💨 Lỗ thông hơi Ø10-15cm — Gò mối ngụy trang', '#aad4aa', z, 11);
    }

    _river(ctx, t, z, proj) {
        const r = proj('ngach_song'); if (!r) return;
        // River water surface area
        ctx.save();
        const rg=ctx.createLinearGradient(r.x-60*z,r.y,r.x+60*z,r.y+20*z);
        rg.addColorStop(0,'rgba(20,80,160,0.55)'); rg.addColorStop(1,'rgba(30,100,200,0.3)');
        ctx.fillStyle=rg; ctx.beginPath();
        ctx.ellipse(r.x,r.y,70*z,22*z,0,0,Math.PI*2); ctx.fill();
        // Wave lines
        ctx.strokeStyle='rgba(100,180,255,0.5)'; ctx.lineWidth=1.5*z;
        for (let wi=0;wi<3;wi++) {
            const wy=r.y-8*z+wi*8*z;
            ctx.beginPath(); ctx.moveTo(r.x-50*z,wy);
            for (let wx=r.x-50*z;wx<r.x+50*z;wx+=4) {
                ctx.lineTo(wx, wy+Math.sin((wx*0.1)+t*3+wi)*3*z);
            }
            ctx.stroke();
        }
        ctx.restore();
        // Ripple particles
        for (const rp of this.ripples) {
            ctx.save(); ctx.globalAlpha=rp.life*0.5; ctx.strokeStyle='rgba(100,180,255,0.8)';
            ctx.lineWidth=1.5*z; ctx.beginPath(); ctx.arc(rp.x,rp.y,rp.r*z,0,Math.PI*2); ctx.stroke(); ctx.restore();
        }
        // Swimmer silhouette
        const sx=r.x-15*z+Math.sin(t)*8*z;
        ctx.save(); ctx.fillStyle='rgba(10,10,20,0.8)';
        ctx.beginPath(); ctx.ellipse(sx,r.y-2*z,18*z,6*z,-0.3,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(sx+18*z,r.y-2*z,5*z,0,Math.PI*2); ctx.fill(); ctx.restore();
        // Mangrove roots
        ctx.save(); ctx.strokeStyle='#3d5a20'; ctx.lineWidth=2*z;
        for (let ri=0;ri<5;ri++) {
            const rx=r.x+40*z+ri*8*z, ry=r.y-15*z;
            ctx.beginPath(); ctx.moveTo(rx,ry); ctx.lineTo(rx+(ri%2?4:-4)*z,ry+20*z); ctx.stroke();
        }
        ctx.restore();
        this._label(ctx, r.x, r.y-55*z, '🌊 Lặn ngầm 5-10m ra sông Sài Gòn', '#44aaff', z, 11);
    }

    _compare(ctx, t, z) {
        const surfY = Projection.project(0, CONFIG.DEPTHS.SURFACE, 0).y;
        // Horizontal divide line
        ctx.save(); ctx.strokeStyle='rgba(255,214,10,0.6)'; ctx.lineWidth=2*z; ctx.setLineDash([12,6]);
        ctx.beginPath(); ctx.moveTo(0,surfY); ctx.lineTo(CONFIG.CANVAS_WIDTH,surfY); ctx.stroke(); ctx.restore();
        // Labels on each side
        this._label(ctx, CONFIG.CANVAS_WIDTH/2, surfY-30, '🔥 TRÊN MẶT ĐẤT — Bom đạn, chất độc hóa học', '#ff6644', Math.min(z,1), 13);
        this._label(ctx, CONFIG.CANVAS_WIDTH/2, surfY+35, '🕯 DƯỚI LÒNG ĐẤT — Kiên cường, sống động', '#ffd60a', Math.min(z,1), 13);
        // Stats
        this._label(ctx, CONFIG.CANVAS_WIDTH/2, 55, '250km hầm  •  70,000 hố bom  •  10 năm đào đắp', '#ffaa44', Math.min(z,1), 14);
    }

    _warzone(ctx, t, z) {
        // Extra smoke puffs across sky
        const surfY = Projection.project(0, CONFIG.DEPTHS.SURFACE, 0).y;
        for (let i=0;i<6;i++) {
            const sx=CONFIG.CANVAS_WIDTH*((i+0.5)/6), sy=surfY - (30 + Math.sin(t*0.5+i)*15)*z;
            const pulse=Math.sin(t*0.4+i)*0.15+0.6;
            ctx.save(); ctx.globalAlpha=pulse*0.25; ctx.fillStyle='#2a2018';
            ctx.beginPath(); ctx.ellipse(sx,sy,40*z,50*z,0,0,Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(sx+20*z,sy-20*z,28*z,36*z,0,0,Math.PI*2); ctx.fill();
            ctx.restore();
        }
        // Orange horizon glow
        const og=ctx.createLinearGradient(0,surfY-60*z,0,surfY);
        og.addColorStop(0,'rgba(255,80,0,0)'); og.addColorStop(1,'rgba(255,80,0,0.25)');
        ctx.fillStyle=og; ctx.fillRect(0,surfY-60*z,CONFIG.CANVAS_WIDTH,60*z);
        this._label(ctx, CONFIG.CANVAS_WIDTH/2, surfY-85, '💥 Cedar Falls 1967 — B-52 ném bom rải thảm — M113 càn quét', '#ff6644', Math.min(z,1), 13);
    }
}

const PhaseDetail = new PhaseDetailEngine();
