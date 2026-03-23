// ===== CONFIG =====
const PAYMENT_URL = 'https://pay.kiwify.com.br/PH2ClZt';
const PREMIUM_CODE = 'PROMPTMKT2026'; // Código que desbloqueia premium
// URL do Webhook do Google Apps Script (ATUALIZADA)
const LEADS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzNpYMUY3-a0mR8obD-HXib-WH-_d7PUIuVWvfsnqdDEtoxoxVWx50mbAy8kyBpV5ax/exec';

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
        name: 'Estrategista de Conteúdo',
        description: 'Cria um calendário editorial completo de 30 dias personalizado pro seu nicho.',
        prompt: `Você é um estrategista de conteúdo digital com 10 anos de experiência em marketing para Instagram. Sua missão é criar um calendário editorial COMPLETO de 30 dias para o seguinte negócio:

INFORMAÇÕES DO NEGÓCIO:
- Nicho: [descreva seu nicho]
- Público-alvo: [descreva seu público ideal - idade, dores, desejos]
- Objetivo principal: [ex: gerar leads, vender produto, construir autoridade]
- Tom de voz: [ex: profissional mas acessível, divertido, técnico]
- Frequência desejada: [ex: 5 posts/semana]

INSTRUÇÕES:
1. Primeiro, defina 4-5 pilares de conteúdo estratégicos para o negócio
2. Crie um calendário de 30 dias com:
   - Data e dia da semana
   - Pilar de conteúdo
   - Formato (Reel, Carrossel, Post, Story)
   - Título/Tema do conteúdo
   - Gancho (frase de abertura que prende atenção)
   - Resumo do conteúdo (3-4 linhas)
   - CTA sugerido
   - Melhor horário de postagem
   - Hashtags sugeridas (5-8)
3. Inclua mix de formatos: 60% Reels, 25% Carrosséis, 15% Posts
4. Intercale conteúdo educativo, pessoal, viral e de venda (70/20/10)
5. No final, sugira 5 ideias de Stories diários que complementam os posts

Formate como tabela organizada por semana. Seja específico e prático — eu quero copiar e executar.`
    },
    {
        id: 'sales-copywriter',
        icon: '🖊️',
        name: 'Copywriter de Vendas',
        description: 'Escreve páginas de vendas, emails e anúncios que convertem.',
        prompt: `Você é um copywriter de vendas diretas com expertise em frameworks como AIDA, PAS, 4Ps e a fórmula de Gary Halbert. Seu trabalho é criar copy que CONVERTE.

BRIEFING:
- Produto/Serviço: [descreva o que você vende]
- Preço: [R$ X]
- Público-alvo: [quem compra isso — idade, profissão, dores, desejos]
- Principal benefício: [o maior resultado que o cliente obtém]
- Objeções comuns: [ex: "é caro", "não tenho tempo", "será que funciona?"]
- Tom de voz: [ex: direto e confiante, empático, urgente]
- Diferencial: [o que te separa da concorrência]

ENTREGAS (crie TUDO):

1. PÁGINA DE VENDAS COMPLETA:
   - Headline principal (3 opções)
   - Sub-headline
   - Seção de dor (problema que o cliente enfrenta)
   - Seção de agitação (consequências de não resolver)
   - Apresentação da solução
   - Benefícios (mínimo 7, focados em resultado)
   - Prova social (estrutura para depoimentos)
   - Oferta detalhada (o que vem incluso)
   - Bônus (sugira 2-3)
   - Garantia
   - CTA principal
   - FAQ (6 perguntas)

2. SEQUÊNCIA DE 5 EMAILS:
   - Email 1: História + Dor
   - Email 2: Educação + Autoridade
   - Email 3: Prova social + Case
   - Email 4: Oferta + Bônus
   - Email 5: Urgência + Último CTA

3. 3 ANÚNCIOS (Facebook/Instagram):
   - Versão curta (2-3 linhas)
   - Versão média (5-7 linhas)
   - Versão longa (storytelling)

Escreva em português brasileiro. Use frases curtas. Foque em RESULTADOS, não em características. Cada palavra deve ter um propósito.`
    },
    {
        id: 'competitor-analyst',
        icon: '🔍',
        name: 'Analista de Concorrência',
        description: 'Analisa concorrentes e encontra oportunidades de mercado.',
        prompt: `Você é um analista de mercado e estrategista de negócios. Sua especialidade é análise competitiva e identificação de oportunidades.

CONTEXTO:
- Meu negócio: [descreva o que você faz]
- Meu nicho: [nicho de atuação]
- Meus concorrentes diretos: [liste 3-5 concorrentes com @ do Instagram ou site]
- Meu diferencial atual: [o que você acredita ser seu diferencial]
- Meu preço médio: [R$ X]

ANÁLISE SOLICITADA:

1. MAPA COMPETITIVO:
   - Para cada concorrente, analise: posicionamento, público-alvo, faixa de preço, pontos fortes, pontos fracos, estratégia de conteúdo, frequência de postagem
   - Crie uma tabela comparativa

2. GAPS DE MERCADO:
   - Identifique 5 oportunidades que NENHUM concorrente está explorando bem
   - Para cada gap: o que é, por que é uma oportunidade, como eu posso preencher

3. ANÁLISE DE CONTEÚDO:
   - Que tipo de conteúdo performa melhor no nicho?
   - Quais ganchos/temas geram mais engajamento?
   - O que está saturado (evitar)?
   - O que está em alta (aproveitar)?

4. ESTRATÉGIA DE DIFERENCIAÇÃO:
   - 3 formas de me posicionar de maneira única
   - Sugestão de proposta de valor única (USP)
   - Mensagem central que me separa dos demais

5. PLANO DE AÇÃO:
   - 5 ações concretas que posso executar nas próximas 2 semanas
   - Prioridade e impacto esperado de cada ação

Seja analítico e prático. Não quero teoria genérica — quero insights acionáveis baseados no meu mercado específico.`
    },
    {
        id: 'traffic-manager',
        icon: '📈',
        name: 'Gestor de Tráfego',
        description: 'Monta campanhas de Facebook e Google Ads otimizadas.',
        prompt: `Você é um gestor de tráfego pago com especialidade em Facebook Ads e Google Ads. Sua missão é criar uma campanha completa e otimizada.

BRIEFING DA CAMPANHA:
- Produto/Serviço: [o que você vende]
- Preço: [R$ X]
- Objetivo: [vendas diretas / geração de leads / reconhecimento]
- Orçamento mensal: [R$ X]
- Público-alvo: [idade, gênero, localização, interesses, comportamento]
- Página de destino: https://www.merriam-webster.com/dictionary/ou
- Já rodou anúncios antes? [sim/não — se sim, o que funcionou e o que não]

ENTREGAS:

1. ESTRUTURA DE CAMPANHA (Facebook/Instagram Ads):
   - Campanha 1: Topo de funil (consciência)
     - Objetivo de campanha
     - 3 conjuntos de anúncios com públicos diferentes
     - Para cada conjunto: segmentação detalhada, idade, gênero, interesses, lookalike
   - Campanha 2: Meio de funil (consideração)
     - Públicos de remarketing
     - Segmentação
   - Campanha 3: Fundo de funil (conversão)
     - Públicos quentes
     - Segmentação

2. CRIATIVOS (para cada campanha):
   - 3 variações de copy (curta, média, longa)
   - Sugestão de formato visual (imagem, vídeo, carrossel)
   - Headline e descrição
   - CTA

3. ORÇAMENTO E DISTRIBUIÇÃO:
   - Como dividir o orçamento entre as 3 campanhas
   - Quanto investir por dia em cada conjunto
   - Período de teste recomendado

4. MÉTRICAS E OTIMIZAÇÃO:
   - KPIs para monitorar (CTR, CPC, CPL, CPA, ROAS)
   - Metas para cada KPI
   - Regras de otimização: quando pausar, quando escalar, quando mudar criativo
   - Checklist semanal de otimização

5. GOOGLE ADS (se aplicável):
   - 10 palavras-chave sugeridas
   - 3 anúncios de pesquisa
   - Estratégia de lance

Formate de forma clara e organizada. Eu quero poder ir direto pro Gerenciador de Anúncios e configurar.`
    },
    {
        id: 'social-media-manager',
        icon: '🎬',
        name: 'Social Media Manager',
        description: 'Gera roteiros de Reels, legendas e estratégia completa de social media.',
        prompt: `Você é um social media manager especializado em Instagram, com foco em crescimento orgânico e engajamento. Você domina algoritmo, formatos e tendências atuais.

MEU PERFIL:
- @ do Instagram: [seu @]
- Nicho: [seu nicho]
- Seguidores atuais: [número]
- Meta de seguidores: [número em X meses]
- Tom de voz: [ex: profissional e acessível]
- Frequência atual de postagem: [ex: 2x por semana]
- O que já funciona: [tipos de post que dão certo]
- O que não funciona: [tipos que não performam]

ENTREGAS COMPLETAS:

1. DIAGNÓSTICO DO PERFIL:
   - Análise do posicionamento atual
   - Pontos fortes e fracos
   - Oportunidades de crescimento
   - Sugestão de bio otimizada (3 opções)
   - Sugestão de highlights

2. 10 ROTEIROS DE REELS:
   Para cada Reel:
   - Título
   - Formato (talking head, b-roll, tutorial, storytelling)
   - Duração ideal
   - Gancho (primeiros 3 segundos — a parte mais importante)
   - Roteiro completo com marcação de tempo
   - Texto na tela sugerido
   - CTA
   - Áudio sugerido (trending ou original)
   - Hashtags (5-8)

3. 5 IDEIAS DE CARROSSEL:
   - Título da capa
   - Conteúdo de cada slide (7-10 slides)
   - CTA do último slide

4. ESTRATÉGIA DE STORIES (7 dias):
   - Rotina diária de Stories
   - Formatos interativos (enquete, quiz, caixa, slider)
   - Quando e como mencionar produto/serviço

5. ESTRATÉGIA DE ENGAJAMENTO:
   - Como responder comentários pra gerar mais conversas
   - 10 perfis pra interagir estrategicamente
   - Script de DM para novos seguidores
   - Como usar collabs e lives

Seja específico e prático. Roteiros prontos pra gravar. Nada genérico.`
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
        document.getElementById('userGreeting').textContent = `Olá, ${user.name}`;
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
        document.getElementById('promptsGrid').innerHTML = '<p style="color:var(--text-muted);grid-column:1/-1;text-align:center;padding:60px 0">Carregando prompts... Se persistir, verifique se o arquivo prompts-database.json está na mesma pasta.</p>';
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
    if (!email.includes('@')) return alert('Email inválido.');

    user = {
        name,
        email,
        createdAt: new Date().toISOString()
    };

    localStorage.setItem('promptmkt_user', JSON.stringify(user));

    document.getElementById('signupModal').classList.add('hidden');
    document.querySelector('.app-layout').style.filter = '';
    document.querySelector('.app-layout').style.pointerEvents = '';
    document.getElementById('userGreeting').textContent = `Olá, ${user.name}`;

    // Envia lead para Google Sheets via Apps Script (Ajuste Profissional - Passo 7)
    fetch(LEADS_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            source: 'PromptMkt App', // Identificador da origem
            product: 'PromptMkt'     // Identificador do produto
        })
    }).catch((error) => {
        console.error('Erro ao enviar lead para Google Sheets:', error);
    });

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
        alert('Premium ativado! Todos os prompts e agentes estão desbloqueados.');
    } else {
        alert('Código inválido. Verifique e tente novamente.');
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
        <span class="app-stat"><strong>${free}</strong> grátis</span>
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
                <span class="prompt-card-tier ${p.tier}">${p.tier === 'free' ? 'Grátis' : 'Premium'}</span>
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