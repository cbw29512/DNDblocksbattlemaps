export interface DMHandlers { onBack: () => void; }
interface Game { id; name; revision: number; status; }
const API='./.netlify/functions/game-api';
async function call(action, input?) {
  const response=await fetch(API+'?action='+encodeURIComponent(action),{method:input?'POST':'GET',
    headers:input?{'Content-Type':'application/json'}:undefined,
    body:input?JSON.stringify(input):undefined,credentials:'same-origin'});
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(response.status===401?'DM sign-in is required. Authentication activates with the Netlify release.':data.error||'Game service unavailable.');
  return data;
}
export function renderDM(root,handlers): void {
  root.innerHTML=`
  <main id="main-content" tabindex="-1" class="simple-page">
    <button id="dm-back" type="button" class="text-back">← Back home</button>
    <section class="join-card">
      <span class="eyebrow">Dungeon Master</span>
      <h1>Your Games</h1>
      <p>Create a private game and invite players with a code. DM authentication and persistence require Netlify integration.</p>
      <div id="dm-feedback" role="status" aria-live="polite">Checking your session…</div>
      <form id="dm-create-form">
        <label for="dm-game-name">Game name</label>
        <input id="dm-game-name" required maxlength="100" placeholder="Friday Adventure"/>
        <button class="button button-primary" type="submit">Create Game</button>
      </form>
      <h2>Saved games</h2>
      <div id="dm-games"></div>
    </section>
  </main>`;
  root.querySelector('#dm-back')?.addEventListener('click',handlers.onBack);
  const feedback=root.querySelector('#dm-feedback')!;
  const games=root.querySelector('#dm-games')!;
  async function refresh(){
    try {
      const result=await call('my-games');
      const list=(result.games||[]) as Game[];
      feedback.textContent=list.length?'Your saved games are ready.':'No games created yet.';
      games.replaceChildren();
      for(const game of list){
        const panel=document.createElement('div');panel.className='dm-game';
        const title=document.createElement('strong');title.textContent=game.name;
        const btn=document.createElement('button');btn.type='button';btn.className='button button-secondary';
        btn.textContent='Create invite';btn.addEventListener('click',async()=>{
          btn.disabled=true;
          try{
            const invite=await call('new-invite',{gameId:game.id});
            const link=new URL(window.location.href);link.search='';link.searchParams.set('view','join');link.searchParams.set('code',invite.code);
            feedback.textContent='Invite: '+invite.code+' · '+link.href+' · Expires in 24 hours.';
          }catch(error){feedback.textContent=error instanceof Error?error.message:'Unable to create invite.';}
          finally{btn.disabled=false;}
        });
        panel.append(title,btn);games.append(panel);
      }
    }catch(error){feedback.textContent=error instanceof Error?error.message:'Game backend unavailable.';}
  }
  root.querySelector('#dm-create-form')?.addEventListener('submit',async event=>{
    event.preventDefault();
    const input=root.querySelector('#dm-game-name');
    if(!input||!input.value.trim())return;
    try{await call('create-game',{name:input.value.trim()});input.value='';await refresh();}
    catch(error){feedback.textContent=error instanceof Error?error.message:'Could not create game.';}
  });
  void refresh();
}
