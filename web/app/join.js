export function renderJoin(root, handlers) {
  const requestedCode=new URLSearchParams(window.location.search).get('code')||'';
  root.innerHTML = `
    <main id="main-content" tabindex="-1" class="simple-page">
      <button class="text-back" id="join-back" type="button">← Back home</button>
      <section class="join-card">
        <span class="eyebrow">Player entry</span>
        <h1>Join a Game</h1>
        <p>Ask your Dungeon Master for a six-character game code. A permanent player account is not required.</p>
        <form id="guest-join-form">
          <label for="guest-code">Game code</label>
          <input id="guest-code" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="10" pattern="[A-Za-z0-9 -]{6,10}" required placeholder="ABCD23" />
          <label for="guest-name">Your name</label>
          <input id="guest-name" autocomplete="nickname" maxlength="40" required placeholder="Your name" />
          <button id="guest-submit" class="button button-primary button-large" type="submit">Join Game</button>
          <p id="guest-feedback" role="status" aria-live="polite"></p>
        </form>
        <p class="join-disclaimer">DM-hosted games require the Netlify multiplayer backend. Map building remains available without an account.</p>
      </section>
    </main>
  `;
  root.querySelector('#join-back')?.addEventListener('click',handlers.onBack);
  const code=root.querySelector('#guest-code');
  const name=root.querySelector('#guest-name');
  const form=root.querySelector('#guest-join-form');
  const button=root.querySelector('#guest-submit');
  const feedback=root.querySelector('#guest-feedback');
  if(code)code.value=requestedCode;
  // Recovery is cookie-bound. A saved name or player ID is never trusted as identity.
  if(button&&feedback){
    button.disabled=true;
    feedback.textContent='Checking for your previous game…';
    void (async()=>{
      try{
        const response=await fetch('./.netlify/functions/game-api?action=my-player-session',{
          method:'GET',credentials:'same-origin',cache:'no-store'
        });
        if(response.status===401){
          if(root.contains(feedback))feedback.textContent='';
          return;
        }
        if(!response.ok)throw new Error('Unable to check your previous game. You can still enter a game code.');
        const result=await response.json();
        if(!result?.player?.id||!result.player.game_id||!result.player.display_name)
          throw new Error('Invalid session response. Enter a game code to join.');
        if(!root.contains(feedback))return;
        if(name)name.value=result.player.display_name;
        const pieces=Array.isArray(result.assignedEntityIds)?result.assignedEntityIds.filter(id=>typeof id==='string'):[];
        feedback.textContent='Welcome back, '+result.player.display_name+'. Reconnected to '+(result.player.game_name||'your game')+
          (pieces.length?' — '+pieces.length+' assigned piece(s).':' — waiting for your DM to assign a character.');
      }catch(error){
        console.error('Guest session recovery failed:',error instanceof Error?error.message:'Unknown error');
        if(root.contains(feedback))feedback.textContent=error instanceof Error?error.message:'Unable to check your previous game.';
      }finally{
        if(root.contains(button))button.disabled=false;
      }
    })();
  }
  form?.addEventListener('submit',async event=>{
    event.preventDefault();
    if(!code||!name||!button||!feedback)return;
    const value=code.value.trim().replace(/[\s-]/g,'').toUpperCase();
    if(!/^[A-HJ-NP-Z2-9]{6}$/.test(value)){
      feedback.textContent='Enter a valid six-character game code.';code.focus();return;
    }
    const display=name.value.trim();
    if(!display||display.length>40){feedback.textContent='Enter a player name (40 characters or fewer).';name.focus();return;}
    button.disabled=true;feedback.textContent='Connecting to your game…';
    try{
      const response=await fetch('./.netlify/functions/game-api?action=join-game',{
        method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',
        body:JSON.stringify({code:value,name:display})
      });
      const result=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(response.status===404?'Game code not found, expired, or backend unavailable.':result.error||'Unable to join this game.');
      feedback.textContent='Joined '+(result.gameName||'the game')+'. Waiting for your DM to assign a character.';
    }catch(error){
      feedback.textContent=error instanceof Error?error.message:'Unable to contact game server. DM/player multiplayer requires Netlify integration.';
    }finally{button.disabled=false;}
  });
}
