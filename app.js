// ===== CONFIG =====
const PAYMENT_URL = '#'; // Trocar pelo link da Kiwify/Hotmart
const PREMIUM_CODE = 'PROMPTMKT2026'; // Codigo que desbloqueia premium

// ===== STATE =====
let allPrompts = [];
let categories = [];
let currentCategory = 'all';
let currentFilter = 'all';
let searchQuery = '';
let user = JSON.parse(localStorage.getItem('promptmkt_user')) || null;
let isPremium = localStorage.getItem('promptmkt_premium') === 'true';

// ===== AGENTS DATA =====
const agents = [
    {
        id: 'content-strategist',
        icon: '📅',
        name: 'Estrategista de Conteudo',
        description: 'Cria um calendario editorial completo de 30 dias personalizado pro seu nicho.',
        prompt: `Voce e um estrategista de conteudo digital com 10 anos de experiencia em marketing para Instagram. Sua missao e criar um calendario editorial COMPLETO de 30 dias para o seguinte negocio:

INFORMACOES DO NEGOCIO:
- Nicho: [descreva seu nicho]
- Publico-alvo: [descreva seu publico ideal - idade, dores, desejos]
- Objetivo principal: [ex: gerar leads, vender produto, construir autoridade]
- Tom de voz: [ex: profissional mas acessivel, divertido, tecnico]
- Frequencia desejada: [ex: 5 posts/semana]

INSTRUCOES:
1. Primeiro, defina 4-5 pilares de conteudo estrategicos para o negocio
2. Crie um calendario de 30 dias com:
   - Data e dia da semana
   - Pilar de conteudo
   - Formato (Reel, Carrossel, Post, Story)
   - Titulo/Tema do conteudo
   - Gancho (frase de abertura que prende atencao)
   - Resumo do conteudo (3-4 linhas)
   - CTA sugerido
   - Melhor horario de postagem
   - Hashtags sugeridas (5-8)
3. Inclua mix de formatos: 60% Reels, 25% Carrosseis, 15% Posts
4. Intercale conteudo educativo, pessoal, viral e de venda (70/20/10)
5. No final, sugira 5 ideias de Stories diarios que complementam os posts

Formate como tabela organizada por semana. Seja especifico e pratico — eu quero copiar e executar.`
    },
    {
        id: 'sales-copywriter',
        icon: '🖊️',
        name: 'Copywriter de Vendas',
        description: 'Escreve paginas de vendas, emails e anuncios que convertem.',
        prompt: `Voce e um copywriter de vendas diretas com expertise em frameworks como AIDA, PAS, 4Ps e a formula de Gary Halbert. Seu trabalho e criar copy que CONVERTE.

BRIEFING:
- Produto/Servico: [descreva o que voce vende]
- Preco: [R$ X]
- Publico-alvo: [quem compra isso — idade, profissao, dores, desejos]
- Principal beneficio: [o maior resultado que o cliente obtem]
- Objecoes comuns: [ex: "e caro", "nao tenho tempo", "sera que funciona?"]
- Tom de voz: [ex: direto e confiante, empático, urgente]
- Diferencial: [o que te separa da concorrencia]

ENTREGAS (crie TUDO):

1. PAGINA DE VENDAS COMPLETA:
   - Headline principal (3 opcoes)
   - Sub-headline
   - Secao de dor (problema que o cliente enfrenta)
   - Secao de agitacao (consequencias de nao resolver)
   - Apresentacao da solucao
   - Beneficios (minimo 7, focados em resultado)
   - Prova social (estrutura para depoimentos)
   - Oferta detalhada (o que vem incluso)
   - Bonus (sugira 2-3)
   - Garantia
   - CTA principal
   - FAQ (6 perguntas)

2. SEQUENCIA DE 5 EMAILS:
   - Email 1: Historia + Dor
   - Email 2: Educacao + Autoridade
   - Email 3: Prova social + Case
   - Email 4: Oferta + Bonus
   - Email 5: Urgencia + Ultimo CTA

3. 3 ANUNCIOS (Facebook/Instagram):
   - Versao curta (2-3 linhas)
   - Versao media (5-7 linhas)
   - Versao longa (storytelling)

Escreva em portugues brasileiro. Use frases curtas. Foque em RESULTADOS, nao em caracteristicas. Cada palavra deve ter um proposito.`
    },
    {
        id: 'competitor-analyst',
        icon: '🔍',
        name: 'Analista de Concorrencia',
        description: 'Analisa concorrentes e encontra oportunidades de mercado.',
        prompt: `Voce e um analista de mercado e estrategista de negocios. Sua especialidade e analise competitiva e identificacao de oportunidades.

CONTEXTO:
- Meu negocio: [descreva o que voce faz]
- Meu nicho: [nicho de atuacao]
- Meus concorrentes diretos: [liste 3-5 concorrentes com @ do Instagram ou site]
- Meu diferencial atual: [o que voce acredita ser seu diferencial]
- Meu preco medio: [R$ X]

ANALISE SOLICITADA:

1. MAPA COMPETITIVO:
   - Para cada concorrente, analise: posicionamento, publico-alvo, faixa de preco, pontos fortes, pontos fracos, estrategia de conteudo, frequencia de postagem
   - Crie uma tabela comparativa

2. GAPS DE MERCADO:
   - Identifique 5 oportunidades que NENHUM concorrente esta explorando bem
   - Para cada gap: o que e, por que e uma oportunidade, como eu posso preencher

3. ANALISE DE CONTEUDO:
   - Que tipo de conteudo performa melhor no nicho?
   - Quais ganchos/temas geram mais engajamento?
   - O que esta saturado (evitar)?
   - O que esta em alta (aproveitar)?

4. ESTRATEGIA DE DIFERENCIACAO:
   - 3 formas de me posicionar de maneira unica
   - Sugestao de proposta de valor unica (USP)
   - Mensagem central que me separa dos demais

5. PLANO DE ACAO:
   - 5 acoes concretas que posso executar nas proximas 2 semanas
   - Prioridade e impacto esperado de cada acao

Seja analitico e pratico. Nao quero teoria generica — quero insights acionaveis baseados no meu mercado especifico.`
    },
    {
        id: 'traffic-manager',
        icon: '📈',
        name: 'Gestor de Trafego',
        description: 'Monta campanhas de Facebook e Google Ads otimizadas.',
        prompt: `Voce e um gestor de trafego pago com especialidade em Facebook Ads e Google Ads. Sua missao e criar uma campanha completa e otimizada.

BRIEFING DA CAMPANHA:
- Produto/Servico: [o que voce vende]
- Preco: [R$ X]
- Objetivo: [vendas diretas / geracao de leads / reconhecimento]
- Orcamento mensal: [R$ X]
- Publico-alvo: [idade, genero, localizacao, interesses, comportamento]
- Pagina de destino: [URL ou descricao]
- Ja rodou anuncios antes? [sim/nao — se sim, o que funcionou e o que nao]

ENTREGAS:

1. ESTRUTURA DE CAMPANHA (Facebook/Instagram Ads):
   - Campanha 1: Topo de funil (consciencia)
     - Objetivo de campanha
     - 3 conjuntos de anuncios com publicos diferentes
     - Para cada conjunto: segmentacao detalhada, idade, genero, interesses, lookalike
   - Campanha 2: Meio de funil (consideracao)
     - Publicos de remarketing
     - Segmentacao
   - Campanha 3: Fundo de funil (conversao)
     - Publicos quentes
     - Segmentacao

2. CRIATIVOS (para cada campanha):
   - 3 variações de copy (curta, media, longa)
   - Sugestao de formato visual (imagem, video, carrossel)
   - Headline e descricao
   - CTA

3. ORCAMENTO E DISTRIBUICAO:
   - Como dividir o orcamento entre as 3 campanhas
   - Quanto investir por dia em cada conjunto
   - Periodo de teste recomendado

4. METRICAS E OTIMIZACAO:
   - KPIs para monitorar (CTR, CPC, CPL, CPA, ROAS)
   - Metas para cada KPI
   - Regras de otimizacao: quando pausar, quando escalar, quando mudar criativo
   - Checklist semanal de otimizacao

5. GOOGLE ADS (se aplicavel):
   - 10 palavras-chave sugeridas
   - 3 anuncios de pesquisa
   - Estrategia de lance

Formate de forma clara e organizada. Eu quero poder ir direto pro Gerenciador de Anuncios e configurar.`
    },
    {
        id: 'social-media-manager',
        icon: '🎬',
        name: 'Social Media Manager',
        description: 'Gera roteiros de Reels, legendas e estrategia completa de social media.',
        prompt: `Voce e um social media manager especializado em Instagram, com foco em crescimento organico e engajamento. Voce domina algoritmo, formatos e tendencias atuais.

MEU PERFIL:
- @ do Instagram: [seu @]
- Nicho: [seu nicho]
- Seguidores atuais: [numero]
- Meta de seguidores: [numero em X meses]
- Tom de voz: [ex: profissional e acessivel]
- Frequencia atual de postagem: [ex: 2x por semana]
- O que ja funciona: [tipos de post que dao certo]
- O que nao funciona: [tipos que nao performam]

ENTREGAS COMPLETAS:

1. DIAGNOSTICO DO PERFIL:
   - Analise do posicionamento atual
   - Pontos fortes e fracos
   - Oportunidades de crescimento
   - Sugestao de bio otimizada (3 opcoes)
   - Sugestao de highlights

2. 10 ROTEIROS DE REELS:
   Para cada Reel:
   - Titulo
   - Formato (talking head, b-roll, tutorial, storytelling)
   - Duracao ideal
   - Gancho (primeiros 3 segundos — a parte mais importante)
   - Roteiro completo com marcacao de tempo
   - Texto na tela sugerido
   - CTA
   - Audio sugerido (trending ou original)
   - Hashtags (5-8)

3. 5 IDEIAS DE CARROSSEL:
   - Titulo da capa
   - Conteudo de cada slide (7-10 slides)
   - CTA do ultimo slide

4. ESTRATEGIA DE STORIES (7 dias):
   - Rotina diaria de Stories
   - Formatos interativos (enquete, quiz, caixa, slider)
   - Quando e como mencionar produto/servico

5. ESTRATEGIA DE ENGAJAMENTO:
   - Como responder comentarios pra gerar mais conversas
   - 10 perfis pra interagir estrategicamente
   - Script de DM para novos seguidores
   - Como usar collabs e lives

Seja especifico e pratico. Roteiros prontos pra gravar. Nada generico.`
    }
];

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async () => {
    // Check auth
    if (!user) {
        document.getElementById('signupModal').classList.remove('hidden');
        document.querySelector('.app-layout').style.filter = 'blur(8px)';
        document.querySelector('.app-layout').style.pointerEvents = 'none';
    } else {
        document.getElementById('signupModal').classList.add('hidden');
        document.getElementById('userGreeting').textContent = `Ola, ${user.name}`;
    }

    // Check premium from URL
    if (new URLSearchParams(window.location.search).get('premium') === 'true') {
        isPremium = true;
        localStorage.setItem('promptmkt_premium', 'true');
    }

    // Update UI based on premium
    updatePremiumUI();

    // Load prompts
    try {
        const res = await fetch('prompts-database.json');
        const data = await res.json();
        categories = data.categories;
        allPrompts = [];
        categories.forEach(cat => {
            cat.prompts.forEach(p => {
                allPrompts.push({ ...p, category: cat.id, categoryName: cat.name_pt, categoryIcon: cat.icon });
            });
        });
        renderSidebar();
        renderPrompts();
        renderStats();
    } catch (e) {
        console.error('Erro ao carregar prompts:', e);
        document.getElementById('promptsGrid').innerHTML = '<p style="color:var(--text-muted);grid-column:1/-1;text-align:center;padding:60px 0">Carregando prompts... Se persistir, verifique se o arquivo prompts-database.json esta na mesma pasta.</p>';
    }

    // Render agents
    renderAgents();

    // Event listeners
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderPrompts();
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderPrompts();
        });
    });

    // Mobile menu
    document.getElementById('mobileMenu').addEventListener('click', function() {
        this.classList.toggle('active');
        document.getElementById('sidebar').classList.toggle('mobile-open');
    });

    // Payment link
    document.getElementById('paymentLink').href = PAYMENT_URL;
});

// ===== AUTH =====
function signup() {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    if (!name || !email) return alert('Preencha nome e email.');
    if (!email.includes('@')) return alert('Email invalido.');

    user = { name, email, createdAt: new Date().toISOString() };
    localStorage.setItem('promptmkt_user', JSON.stringify(user));

    document.getElementById('signupModal').classList.add('hidden');
    document.querySelector('.app-layout').style.filter = '';
    document.querySelector('.app-layout').style.pointerEvents = '';
    document.getElementById('userGreeting').textContent = `Ola, ${user.name}`;

    // Save lead (in production, send to API/webhook)
    console.log('Novo lead:', user);
}

function logout() {
    localStorage.removeItem('promptmkt_user');
    localStorage.removeItem('promptmkt_premium');
    location.reload();
}

function showUpgradeModal() {
    document.getElementById('upgradeModal').classList.remove('hidden');
}

function closeUpgradeModal() {
    document.getElementById('upgradeModal').classList.add('hidden');
}

function activatePremium() {
    const code = document.getElementById('premiumCode').value.trim().toUpperCase();
    if (code === PREMIUM_CODE) {
        isPremium = true;
        localStorage.setItem('promptmkt_premium', 'true');
        closeUpgradeModal();
        updatePremiumUI();
        renderPrompts();
        renderAgents();
        alert('Premium ativado! Todos os prompts e agentes estao desbloqueados.');
    } else {
        alert('Codigo invalido. Verifique e tente novamente.');
    }
}

function updatePremiumUI() {
    if (isPremium) {
        document.getElementById('floatingUpgrade').classList.add('hidden');
        document.getElementById('btnPremiumNav').classList.add('hidden');
    }
}

// ===== SIDEBAR =====
function renderSidebar() {
    const container = document.getElementById('sidebarCategories');
    container.innerHTML = categories.map(cat => {
        const count = cat.prompts.length;
        return `<button class="sidebar-item" data-category="${cat.id}">
            <span class="sidebar-item-icon">${cat.icon}</span>
            ${cat.name_pt}
            <span class="sidebar-item-count">${count}</span>
        </button>`;
    }).join('');

    document.getElementById('countAll').textContent = allPrompts.length;

    // Click events
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            currentCategory = item.dataset.category;

            if (currentCategory === 'agents') {
                document.getElementById('promptsGrid').classList.add('hidden');
                document.getElementById('agentsSection').classList.remove('hidden');
                document.getElementById('appStats').classList.add('hidden');
                document.querySelector('.app-header').classList.add('hidden');
            } else {
                document.getElementById('promptsGrid').classList.remove('hidden');
                document.getElementById('agentsSection').classList.add('hidden');
                document.getElementById('appStats').classList.remove('hidden');
                document.querySelector('.app-header').classList.remove('hidden');
                renderPrompts();
            }
        });
    });
}

// ===== STATS =====
function renderStats() {
    const total = allPrompts.length;
    const free = allPrompts.filter(p => p.tier === 'free').length;
    const premium = total - free;
    document.getElementById('appStats').innerHTML = `
        <span class="app-stat"><strong>${total}</strong> prompts total</span>
        <span class="app-stat"><strong>${free}</strong> gratis</span>
        <span class="app-stat"><strong>${premium}</strong> premium</span>
    `;
}

// ===== PROMPTS =====
function renderPrompts() {
    let filtered = [...allPrompts];

    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }

    if (currentFilter === 'free') {
        filtered = filtered.filter(p => p.tier === 'free');
    } else if (currentFilter === 'premium') {
        filtered = filtered.filter(p => p.tier === 'premium');
    }

    if (searchQuery) {
        filtered = filtered.filter(p =>
            p.title_pt.toLowerCase().includes(searchQuery) ||
            p.prompt_pt.toLowerCase().includes(searchQuery) ||
            p.tags.some(t => t.toLowerCase().includes(searchQuery))
        );
    }

    const grid = document.getElementById('promptsGrid');

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="color:var(--text-muted);grid-column:1/-1;text-align:center;padding:60px 0">Nenhum prompt encontrado.</p>';
        return;
    }

    grid.innerHTML = filtered.map(p => {
        const isLocked = p.tier === 'premium' && !isPremium;
        const truncated = p.prompt_pt.substring(0, 180) + '...';

        return `<div class="prompt-card ${isLocked ? 'locked' : ''}">
            <div class="prompt-card-header">
                <span class="prompt-card-cat">${p.categoryIcon} ${p.categoryName}</span>
                <span class="prompt-card-tier ${p.tier}">${p.tier === 'free' ? 'Gratis' : 'Premium'}</span>
            </div>
            <h3 class="prompt-card-title">${p.title_pt}</h3>
            <p class="prompt-card-text ${isLocked ? 'blurred' : ''}">${isLocked ? truncated : p.prompt_pt}</p>
            <div class="prompt-card-tags">
                ${p.tags.map(t => `<span>${t}</span>`).join('')}
            </div>
            ${isLocked ? `
                <div class="lock-overlay">
                    <span class="lock-icon">🔒</span>
                    <span class="lock-text">Prompt Premium</span>
                    <button class="btn-unlock" onclick="showUpgradeModal()">Desbloquear — R$ 97</button>
                </div>
            ` : `
                <div class="prompt-card-actions">
                    <button class="btn-copy" onclick="copyPrompt(this, ${p.id})">Copiar prompt</button>
                </div>
            `}
        </div>`;
    }).join('');
}

// ===== COPY =====
function copyPrompt(btn, id) {
    const prompt = allPrompts.find(p => p.id === id);
    if (!prompt) return;

    navigator.clipboard.writeText(prompt.prompt_pt).then(() => {
        btn.textContent = 'Copiado!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.textContent = 'Copiar prompt';
            btn.classList.remove('copied');
        }, 2000);
    });
}

// ===== AGENTS =====
function renderAgents() {
    const grid = document.getElementById('agentsGrid');
    grid.innerHTML = agents.map(agent => {
        const isLocked = !isPremium;
        return `<div class="app-agent-card">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
                <span style="font-size:28px">${agent.icon}</span>
                <h3 style="margin:0">${agent.name}</h3>
                ${isLocked ? '<span style="font-size:12px;padding:2px 10px;background:var(--gold-dim);color:var(--gold);border-radius:100px;font-weight:600;margin-left:auto">Premium</span>' : ''}
            </div>
            <p>${agent.description}</p>
            ${isLocked ? `
                <button class="btn-unlock" onclick="showUpgradeModal()">Desbloquear Premium — R$ 97</button>
            ` : `
                <button class="btn-agent" onclick="copyAgent('${agent.id}', this)">Copiar prompt do agente</button>
            `}
        </div>`;
    }).join('');
}

function copyAgent(id, btn) {
    const agent = agents.find(a => a.id === id);
    if (!agent) return;

    navigator.clipboard.writeText(agent.prompt).then(() => {
        btn.textContent = 'Copiado!';
        btn.style.background = 'var(--green)';
        setTimeout(() => {
            btn.textContent = 'Copiar prompt do agente';
            btn.style.background = 'var(--accent)';
        }, 2000);
    });
}
