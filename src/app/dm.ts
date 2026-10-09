export interface DMHandlers { onBack: () => void; }
interface Game { id: string; name: string; revision: number; status: string; }
const API='./.netlify/functions/game-api';
async function call(action: string, input?: unknown): Promise<any> {
  const response=await fetch(API+'?action='+encodeURIComponent(action),{method:input?'POST':'GET',
    headers:input?{'Content-Type':'application/json'}:undefined,
    body:input?JSON.stringify(input):undefined,credentials:'same-origin'});
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(response.status===401?'DM sign-in is required. Authentication activates with the Netlify release.':data.error||'Game service unavailable.');
  return data;
}
export function renderDM(root: HTMLElement,handlers: DMHandlers): void {
  root.innerHTML=`
  <main id="main-content" tabindex="-1" class="simple-page">
    <button id="dm-back" type="button" class="text-back">← Back home</button>
    <section class="join-card">
      <span class="eyebrow">Dungeon Master</span>
      <h1>Your Games</h1>
      <p>Create a private game and invite players with a code. DM authentication and persistence require Netlify integration.</p>
      <form id="dm-auth-form" autocomplete="on">
        <h2>DM account</h2>
        <label for="dm-email">Email</label><input id="dm-email" type="email" required autocomplete="email" />
        <label for="dm-password">Password</label><input id="dm-password" type="password" required minlength="8" autocomplete="current-password" />
        <div class="hero-actions">
          <button id="dm-login" type="submit" class="button button-primary">Sign in</button>
          <button id="dm-signup" type="button" class="button button-secondary">Create account</button>
          <button id="dm-logout" type="button" class="button button-ghost" hidden>Sign out</button>
        </div>
      </form>
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
  const feedback=root.querySelector<HTMLElement>('#dm-feedback')!;
  const games=root.querySelector<HTMLElement>('#dm-games')!;
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
  root.querySelector<HTMLFormElement>('#dm-create-form')?.addEventListener('submit',async event=>{
    event.preventDefault();
    const input=root.querySelector<HTMLInputElement>('#dm-game-name');
    if(!input||!input.value.trim())return;
    try{await call('create-game',{name:input.value.trim()});input.value='';await refresh();}
    catch(error){feedback.textContent=error instanceof Error?error.message:'Could not create game.';}
  });
  const loginForm=root.querySelector<HTMLFormElement>('#dm-auth-form')!;
  const email=root.querySelector<HTMLInputElement>('#dm-email')!;
  const password=root.querySelector<HTMLInputElement>('#dm-password')!;
  const logoutButton=root.querySelector<HTMLButtonElement>('#dm-logout')!;
  const createForm=root.querySelector<HTMLFormElement>('#dm-create-form')!;
  createForm.hidden=true;
  async function identity() {
    // Load only in Netlify-hosted builds; GitHub Pages retains a clear disabled state.
    if(!window.location.hostname.endsWith('.netlify.app') && !window.location.hostname.endsWith('.netlify.dev')){
      feedback.textContent='DM accounts become available after Netlify integration.';
      return null;
    }
    return import('@netlify/identity');
  }
  async function checkSession(){
    try {
      const auth=await identity();if(!auth)return;
      await auth.handleAuthCallback();
      const user=await auth.getUser();
      createForm.hidden=!user;
      logoutButton.hidden=!user;
      if(user){feedback.textContent='Signed in as '+user.email;await refresh();}
      else feedback.textContent='Sign in or create your DM account.';
    }catch(error){feedback.textContent=error instanceof Error?error.message:'DM sign-in service unavailable.';}
  }
  loginForm.addEventListener('submit',async event=>{
    event.preventDefault();
    try {const auth=await identity();if(!auth)return;
      await auth.login(email.value,password.value);password.value='';await checkSession();
    }catch(error){feedback.textContent=error instanceof Error?error.message:'Sign-in unsuccessful.';}
  });
  root.querySelector('#dm-signup')?.addEventListener('click',async()=>{
    try{const auth=await identity();if(!auth)return;
      await auth.signup(email.value,password.value);password.value='';
      feedback.textContent='Check your email to confirm your DM account before signing in.';
    }catch(error){feedback.textContent=error instanceof Error?error.message:'Could not create account.';}
  });
  logoutButton.addEventListener('click',async()=>{
    try{const auth=await identity();if(!auth)return;
      await auth.logout();createForm.hidden=true;logoutButton.hidden=true;games.replaceChildren();
      feedback.textContent='Signed out.';
    }catch(error){feedback.textContent=error instanceof Error?error.message:'Unable to sign out.';}
  });
  void checkSession();
}
