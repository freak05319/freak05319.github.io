let game,scene=location.hash.slice(1)||'desktop',eye=false;
const valid=new Set(['desktop','1601','1602','1602-b','1602-c','1603','1603-b','1603-c']);
const $=id=>document.getElementById(id);
function select(id){if(!valid.has(id))return;scene=id;const base=id.split('-')[0];$('variants').hidden=!['1602','1603'].includes(base);$('variant').value=id.slice(base.length);$('eye').disabled=!game||base!=='desktop';eye=false;$('eye').setAttribute('aria-pressed','false');if(game){game.SendMessage('PortfolioBridge','LoadExhibit',id);$('status').textContent=base==='desktop'?'点击桌面图标打开窗口，拖动标题栏调整位置。':'使用原游戏场景与动画。可切换片段或重新播放。';}}
window.addEventListener('message',event=>{if(event.origin===location.origin&&event.data?.type==='exhibit')select(event.data.scene)});
$('variant').onchange=()=>select(scene.split('-')[0]+$('variant').value);
$('replay').onclick=()=>select(scene);$('eye').onclick=()=>{eye=!eye;game.SendMessage('PortfolioBridge','SetEye',eye?'1':'0');$('eye').setAttribute('aria-pressed',String(eye))};$('full').onclick=()=>game.SetFullscreen(1);
const script=document.createElement('script');script.src='WebGL/Build/WebGL.loader.js';script.onerror=()=>$('status').textContent='加载器读取失败，请刷新重试。';script.onload=async()=>{try{game=await createUnityInstance($('canvas'),{dataUrl:'WebGL/Build/WebGL.data',frameworkUrl:'WebGL/Build/WebGL.framework.js',codeUrl:'WebGL/Build/WebGL.wasm',companyName:'freEak',productName:'The Infodemic - Portfolio Showcase',productVersion:'1.0'},progress=>$('status').textContent=`正在加载 ${Math.round(progress*100)}%`);$('replay').disabled=false;$('full').disabled=false;select(scene)}catch(error){$('status').textContent='加载失败，请刷新重试：'+error.message}};document.body.appendChild(script);
window.addEventListener('pagehide',()=>game?.Quit());
