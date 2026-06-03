import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import { processLessonForExam } from '../src/lib/gemini';

const lessonsData = [
  {
    title: "[AULA 1] - Modelo OSI vs TCP/IP: cada camada dissecada",
    videoUrl: "https://www.youtube.com/watch?v=epXngHQKdEw",
    content: `A compreensão profunda da comunicação em redes de computadores exige a análise minuciosa de modelos de referência empíricos e teóricos que padronizam a interoperabilidade entre sistemas de hardware e software heterogêneos. Historicamente, o desenvolvimento das telecomunicações digitais culminou na adoção de dois modelos arquitetônicos predominantes: o Modelo OSI (Open Systems Interconnection) e a suíte de protocolos TCP/IP. O modelo OSI foi introduzido pela International Organization for Standardization (ISO) como um framework estritamente teórico, estruturado em sete camadas bem definidas, com o objetivo de guiar o design de protocolos independentes de fornecedores. Em contrapartida, o modelo TCP/IP, desenvolvido sob a égide do Departamento de Defesa dos Estados Unidos (DoD) para a ARPANET, constitui um conjunto pragmático de quatro camadas que reflete a implementação real e tangível que fundamenta a arquitetura de roteamento da internet contemporânea.
O mecanismo central que viabiliza o trânsito de informações através destas camadas é denominado encapsulamento. À medida que um bloco de dados é processado a partir do aplicativo do usuário no host de origem em direção ao meio físico, o software da pilha de rede de cada camada anexa um cabeçalho de controle específico, e ocasionalmente um rodapé, transformando os dados puros em uma Unidade de Dados de Protocolo (PDU) correspondente àquela respectiva camada. Esse processo contínuo de envelopamento digital garante que os roteadores, firewalls e comutadores (switches) no caminho da rede possuam metadados suficientes para direcionar, fragmentar e entregar a mensagem, para que o processo de desencapsulamento reverso ocorra perfeitamente no host de destino.
Para a disciplina de segurança da informação e engenharia de tráfego, a dissecação isolada das sete camadas do modelo OSI revela as superfícies de ataque específicas, permitindo a construção de defesas em profundidade. A base teórica inicia-se na Camada Física, cuja função primária é a codificação e a transmissão bruta de sinais binários pelo meio guiado (cabeamento metálico ou óptico) ou não guiado (radiofrequência). A PDU nesta interface é estritamente o bit. As vulnerabilidades associadas à base física englobam a escuta clandestina direta (wiretapping), a interferência de radiofrequência (jamming) e a manipulação eletromagnética, cenários onde o isolamento físico se torna o único mecanismo de defesa viável.
Ascendendo na arquitetura, encontra-se a Camada de Enlace de Dados, que providencia a transferência de dados nó a nó de forma confiável dentro do mesmo domínio de difusão local (LAN). Esta camada utiliza o endereçamento físico, universalmente conhecido como endereço MAC (Media Access Control), e transforma os bits em quadros (Frames). A camada de enlace é subestruturada em duas subcamadas: o Controle de Enlace Lógico (LLC) para multiplexação de protocolos superiores, e o MAC, para o controle de acesso ao barramento. Ataques de saturação da tabela de comutadores (MAC Flooding) e o envenenamento de tabelas de resolução de endereços operam explorando as limitações de confiança desta camada.
A terceira iteração lógica é a Camada de Rede, o epicentro do roteamento interdomínios. Responsável pelo encaminhamento lógico de pacotes através de múltiplas redes autônomas, esta camada opera essencialmente sobre os protocolos IPv4 e IPv6, transformando os quadros recebidos em Pacotes (Packets). Os roteadores e firewalls de borda exercem suas funções predominantemente inspecionando os cabeçalhos IP. Vetores de ataque complexos, incluindo a falsificação de endereços de origem (IP Spoofing) e a fragmentação maliciosa projetada para burlar Sistemas de Detecção de Intrusões (IDS), aproveitam-se diretamente dos campos de fragmentação e tempo de vida (TTL) estabelecidos nesta camada.
A Camada de Transporte atua como o mediador entre as funções orientadas à rede e as funções orientadas à aplicação, garantindo o sequenciamento, o controle de fluxo e a recuperação de erros na transferência de dados fim-a-fim. As unidades de dados convertem-se em Segmentos quando regidas pelo protocolo TCP (confiável e orientado a conexão) ou em Datagramas sob o protocolo UDP (rápido, sem garantias de entrega). O endereçamento de transporte é gerenciado por portas lógicas, numeradas de 1 a 65535, que permitem a multiplexação de múltiplos serviços simultâneos no mesmo host. Varreduras de vulnerabilidade e ataques clássicos de negação de serviço, como as inundações de portas, miram as estruturas de controle de estado alocadas por esta camada lógica.
As três camadas superiores do modelo OSI representam operações de software que o modelo TCP/IP funde em sua camada unificada de Aplicação. A Camada de Sessão administra o diálogo temporal entre dois sistemas finais, coordenando o estabelecimento, a manutenção e o encerramento da comunicação através de checkpoints estruturados. A Camada de Apresentação exerce a função de um tradutor universal, responsável por converter os dados transmitidos de forma que fiquem estruturalmente padronizados, executando rotinas críticas de criptografia e descompressão, de modo que um código ASCII seja perfeitamente interpretado por um receptor operando em codificação EBCDIC. O conjunto de protocolos SSL/TLS atua conceitualmente no limite entre a camada de transporte e a de apresentação. Por fim, a Camada de Aplicação estabelece a fronteira de interação direta com os agentes de usuário, oferecendo os protocolos de rede, como HTTP, SMTP e DNS, para consumo dos softwares. Ataques denominados de "Camada 7", como a injeção estruturada de código e sobrecargas de solicitações HTTP dinâmicas, exploram as regras complexas interpretadas pelos próprios programas residentes nesta camada mais alta.`
  },
  {
    title: "[AULA 2] - Three-Way Handshake: SYN, SYN-ACK, ACK",
    videoUrl: "https://www.youtube.com/watch?v=1X-b7L0BzOk",
    content: `A confiabilidade irrestrita exigida pelas aplicações web, serviços de correio eletrônico e transferência remota de arquivos está inexoravelmente ligada aos fundamentos mecânicos do Transmission Control Protocol (TCP). Este protocolo se diferencia radicalmente de abordagens assíncronas ao estabelecer um paradigma fortemente orientado a conexões lógicas, o que obriga a garantia transacional e a reconstrução ordenada da informação recebida. A infraestrutura arquitetônica que viabiliza essa garantia de robustez reside na etapa preliminar de negociação das comunicações, um protocolo metódico de estabelecimento de sessão universalmente conhecido como Three-Way Handshake, ou aperto de mãos de três vias.
O funcionamento do TCP depende de um cabeçalho encapsulado de vinte bytes. A sinalização comportamental que dita as ações a serem tomadas pelo receptor é governada por seis bits essenciais, chamados de marcadores lógicos ou Flags (URG, ACK, PSH, RST, SYN e FIN). O procedimento de sincronização do Handshake possui um objetivo primário claro: permitir que o sistema cliente e o sistema servidor declarem suas capacidades de recepção, alinhem o tamanho inicial da janela deslizante para controle de fluxo e, mais crucialmente, sincronizem os seus Números de Sequência Iniciais (Initial Sequence Numbers - ISN). A aleatorização rigorosa do ISN é um imperativo criptográfico para impedir ataques de previsão de números de sequência, vetores utilizados no passado para o sequestro contínuo de sessões ativas.
O fluxo de estabelecimento ocorre rigorosamente em três trocas de segmentos, progredindo de forma linear. Na primeira etapa de sincronização, o sistema originador (Cliente) formula e envia ao destino (Servidor) um segmento contendo o seu Número de Sequência Inicial gerado estocasticamente, ativando, no cabeçalho TCP, a flag SYN (Synchronize). Esta requisição alerta a pilha de rede do servidor sobre o desejo de estabelecimento de sessão, e o socket do cliente transita imediatamente para o estado denominado SYN_SENT. O sistema aguarda, então, um eco do seu par.
Durante a segunda etapa, o Servidor, assumindo que possua o processo correspondente à porta de destino vinculado a um estado de escuta (LISTEN), recebe o datagrama inicial e reserva estruturas de memória correspondentes na sua tabela de estados da pilha do kernel. Em retorno, o servidor aciona as flags SYN e ACK de forma simultânea. Este segmento híbrido carrega a responsabilidade dupla de notificar o seu próprio Número de Sequência Inicial (através do SYN) e de reconhecer formalmente a requisição do cliente. O número de confirmação contido na resposta corresponde de maneira exata ao ISN enviado pelo cliente acrescido de um incremento de valor um. Com a expedição deste pacote, o socket do servidor ingressa no estado temporário de SYN_RCVD, estabelecendo uma conexão semiaberta à espera do passo derradeiro.
Na terceira e final iteração, a máquina Cliente processa o segmento SYN-ACK recebido, valida o incremento da sua sequência prévia e finaliza o acordo transmitindo um segmento contendo exclusivamente a flag ACK. Este pacote ratifica o recebimento do ISN do servidor, designando no campo de reconhecimento o valor do ISN recebido adicionado de um. O estado das interfaces de rede em ambos os terminais progride para o estágio de ESTABLISHED. Somente a partir deste alinhamento mútuo as partes estão autorizadas a iniciar o envio e recepção do verdadeiro conteúdo informacional em nível de camada de aplicação.
A análise meticulosa deste comportamento é o cerne do desenvolvimento defensivo contra ataques de interrupção em nuvem. A etapa crítica do handshake reside no estado transitório SYN_RCVD, que expõe os servidores a ataques sistemáticos de Negação de Serviço, especificamente a variante conhecida como SYN Flood. A técnica de ataque subverte a boa-fé arquitetônica do protocolo TCP ao forjar milhões de pacotes SYN, muitas vezes obscurecendo a real origem do tráfego através de IP Spoofing. O servidor aloca memória contígua e limitante na sua estrutura de controle Backlog para cada conexão e responde com os pacotes SYN-ACK correspondentes. Como o originador forjado jamais retornará o ACK final do Passo 3, o banco de memória do servidor eventualmente sofre depleção absoluta de recursos, induzindo um colapso completo que rejeita conexões de clientes legítimos.`
  },
  {
    title: "[AULA 3] - Port Scanning com Nmap: -sV, -sC, -O flags",
    videoUrl: "https://www.youtube.com/watch?v=16iwQ_EJdsU",
    content: `O ciclo cibernético de testes de intrusão sistêmicos e operações de Defesa Ativa inicia-se invariavelmente pela etapa de reconhecimento profundo. A habilidade de mapear os vetores vetoriais em superfícies de ataque remotas requer uma inspeção rigorosa das portas lógicas associadas ao endereçamento de transporte da infraestrutura em avaliação. Na vanguarda dessa disciplina operacional encontra-se o Nmap (Network Mapper), a ferramenta padrão de mercado para descoberta de hosts e auditoria abrangente da topografia de redes. O ato técnico de escanear portas, no seu aspecto mais elementar, tange a determinação do estado de conectividade: a classificação das interfaces como abertas (ouvindo requisições), fechadas (recusando) ou filtradas (protegidas sob um plano de contingência de Firewall). Contudo, a varredura primária é puramente quantitativa e carece da resolução de inteligência necessária para planejar explorações dirigidas ou elaborar relatórios de mitigação de risco precisos.
Para suprir o déficit de informações contextuais, parâmetros estruturados (flags) foram desenvolvidos para induzir os alvos a revelar suas arquiteturas subjacentes. A exploração semântica com Nmap manifesta-se no refinamento proporcionado pelos comandos -sV, -sC e -O. Ao conjugar estas marcações, o escopo de varredura transcende a mera enunciação de disponibilidade para executar engajamentos altamente inquisitivos sobre o comportamento e a base tecnológica do receptor.
A bandeira -sV instaura os algoritmos focados na Detecção de Versões de Serviços (Service Version Detection). Encontrar uma porta TCP em estado aberto sinaliza a vigência de um túnel de comunicação, porém não identifica a taxonomia intrínseca da aplicação responsável pela sua gestão. Uma porta padronizada como 80 pode operar tanto um serviço IIS corporativo quanto um web server Apache embarcado e defasado. A execução da flag -sV obriga o motor do Nmap a realizar o envio de diversas sondas padronizadas — requisições desenhadas meticulosamente (probes) emulando clientes válidos em múltiplos protocolos. A máquina receptora, induzida pelas chamadas, retorna dados estruturados de controle. A saída é inspecionada analiticamente contra as milhares de assinaturas presentes no banco de dados interno nmap-service-probes.
Simultaneamente à detecção do binário, a bandeira -sC invoca a robusta Nmap Scripting Engine (NSE). Construída sobre a leveza interpretativa da linguagem Lua, a NSE possibilita o despache massivo e paralelo de tarefas procedimentais que automatizam o escrutínio de falhas comuns em rede. A sinalização -sC abrange os diretórios designados universalmente sob o escopo de roteiros 'default' e 'safe'.
As sondagens orientadas aos deamons adquirem significado amplificado quando a topologia do substrato operacional é revelada. A identificação ativada pela flag -O executa a "Cópia Digital de Sistemas Operacionais" (Active OS Fingerprinting). Diferentes programações de Kernels, sejam variantes de Linux, FreeBSD ou clusters Windows, manifestam idiossincrasias particulares em resposta à montagem anômala dos datagramas e fragmentos TCP.
A implicação arquitetônica para os sistemas de defesa foca-se essencialmente nas métricas operacionais relativas ao conceito de OpSec (Segurança Operacional). Varreduras repletas de flags exploratórias que empregam sondas não padronizadas, scripts automatizados e datagramas fraturados carecem do atributo técnico da evasão silenciosa. A geração ininterrupta de um volume massivo de anomalias no tráfego resulta na ativação inelutável e instantânea dos limiares de bloqueio das regras contidas em dispositivos Intrusive Prevention Systems (IPS).`
  },
  {
    title: "[AULA 4] - DNS Enumeration & Zone Transfer attacks",
    videoUrl: "https://www.youtube.com/watch?v=kdYnSfzb3UA",
    content: `O paradigma da comunicação virtual apoia-se num sistema matricial essencial que translitera strings numéricas roteáveis em linguagens inteligíveis a humanos. O Domain Name System (DNS) fundamenta este núcleo de serviço como um complexo banco de dados hierárquico e globalmente distribuído. As iterações entre resolutores de clientes, servidores locais de internet, autoritários de nível superior (TLDs) e bancos de raiz efetuam resoluções de domínios valendo-se, majoritariamente e em virtude das demandas intrínsecas de velocidade em solicitações curtas, da porta lógica 53 sob os padrões de datagramas do protocolo UDP.
A manipulação da infraestrutura DNS para coleta passiva de artefatos delineia a fase tática designada como DNS Enumeration, focada metodicamente no reconhecimento sistemático e exaustivo de cada subdomínio corporativo em produção. Os analistas rastreiam metadados contidos em uma diversidade expressiva de registros (Records). Registros do Tipo A providenciam ligações nativas a terminais de IP versão 4; registros CNAME mascaram sistemas mediante identificadores espelhados (aliases); registros MX sinalizam geograficamente as localizações dos gateways receptores de e-mail; e as entradas do Tipo TXT arquivam matrizes de certificados descritivos.
A vulnerabilidade clássica, severa e arquitetural detectada ao longo das pesquisas em servidores autoritários resulta de um erro pragmático de engenharia focado no desígnio de replicação: os ataques de Zone Transfer (Transferência de Zona). A nomenclatura técnica base do procedimento é a operação de comando AXFR (Authoritative Zone Transfer). O escopo do recurso foi criado por concepções de arquitetura resiliente.
O vetor de exploração subverte e corrompe o princípio benigno quando administradores de sistemas deixam as configurações legadas no formato aberto. Um provedor vulnerabilizado em face de um controle de diretivas inadequado jamais filtra se o peticionário do AXFR pertence à lista real dos hosts subsidiários mapeados dentro das instâncias privadas da empresa.
A obtenção total das strings das zonas resulta no pior cenário potencial relativo à perda precoce de informações táticas. A falha permite aos profissionais maliciosos derivar um entendimento minucioso do fluxo geográfico arquitetural dos bancos de dados antes de realizarem acessos efetivos.
O emprego das políticas sistêmicas voltadas para reprimir esta vulnerabilidade envolve o cerceamento da visibilidade irrestrita via abordagens granulares. A primeira barreira impõe a desabilitação total da emissão de zonas não delimitadas configurando opções nas diretivas centrais ordenando explicitamente e negando, sob quaisquer hipóteses, o reenvio de tabelas AXFR para equipamentos que não figurem nas regras permitidas estáticas. Contudo, a segurança da informação prescreve que defesas estruturadas em IPs configurados estaticamente ainda padecem dos riscos inerentes associados ao sequestro e roubo de identidades de enderaçamento. A arquitetura corporativa em nuvem eleva o nível exigindo o acoplamento do método Transaction Signatures (TSIG).`
  },
  {
    title: "[AULA 5] - ARP Spoofing e Man-in-the-Middle (MitM)",
    videoUrl: "https://www.youtube.com/watch?v=SP1EHZJf_y0",
    content: `As trocas contínuas que abastecem a conectividade restrita, circunscritas dentro dos limites logísticos das interfaces em domínios de broadcast (LANs), processam-se distantes do complexo mundo das identificações roteáveis em nuvem e repousam nos mecanismos de baixo nível integrados intrinsecamente aos transceptores eletromagnéticos do dispositivo. Conquanto o paradigma geral imponha a designação do pacote na perspectiva do fluxo IPv4, o processo comunicativo exige incondicionalmente a elucidação atrelada ao número estático inserido permanentemente nos cartões de rede — os Endereços de Controle de Acesso a Mídia (endereçamento MAC). O Address Resolution Protocol (ARP), operando nas esferas tangenciais situadas entre os modelos físicos e os comutadores de rede lógica, ocupa a posição cardinal no orquestramento desses descobrimentos dinâmicos subjacentes às conexões locais.
A mecânica de comunicação idealizada baseia-se num sistema operacional assíncrono consubstanciado no intercâmbio rápido focado na resolução e armazenamento temporário, por intermédio de dois polos vitais de interações informativas. Inicialmente, um Host que busca enviar uma matriz de blocos aos destinos necessita traduzir a designação contida no IP desejado descobrindo a propriedade MAC do alvo. Portanto, a interface engatilha em formato aberto o seu pedido e expede na infraestrutura adjacente, interpelando ativamente todos os ouvintes do barramento com um quadro de ARP Request estruturado do tipo Broadcast.
As vulnerabilidades elementares exploradas pelo modelo da arquitetura cibernética originam-se em falhas conceituais provenientes do contexto histórico benigno da especificação normativa. O protocolo ARP padece criticamente da absoluta ausência do gerenciamento intrínseco de Estado e Confiança. A arquitetura foi programada para maximizar as transferências sem incorrer nos gastos da validação digital pesada de pacotes.
O esfacelamento deste desenho teórico origina e consagra a implementação letal designada comumente como ARP Spoofing (Falsificação Direcionada) ou o Envenenamento de Mapeamento, a porta de acesso cardinal responsável por ancorar a operação mais crítica inerente às interceptações lógicas: os ataques Man-in-the-Middle (Homem no Meio do Trânsito). Operando em táticas silenciosas e municiado de analisadores sintáticos e injetores robustos incorporados em utilitários como Ettercap ou ferramentas nativas em sistemas ofensivos Kali Linux, o atacante centraliza o barramento, promovendo o colapso do esquema de verificação ponta a ponta e substituindo o fluxo verdadeiro pelo desvio sistemático do Gateway perimetral.
Sob o escopo da interceptação contínua, os fluxos oriundos e convergentes perdem a capacidade de atingirem diretamente a fronteira externa em comutações L2 genuínas, despachando toda a matriz para a estrutura injetada.
As matrizes mitigadoras recaem nas premissas exigentes do encapsulamento restritivo contidos na centralidade dos switches coesos gerenciáveis sob os padrões das redes (e.g. Cisco/Juniper). As premissas consistem na junção e intersecção da Inspeção Dinâmica atrelada à checagem estática da obtenção da conectividade através do controle duplo. Ao habilitar o preceito de Defesa em Profundidade das infraestruturas de switch chamadas de DHCP Snooping, o hardware rastreia as distribuições fidedignas dos sistemas providenciadas internamente.`
  },
  {
    title: "[AULA 6] - Subnetting, CIDR e cálculo de máscaras",
    videoUrl: "https://www.youtube.com/watch?v=Dob1cAP_9o4",
    content: `No escopo fundamental pertinente ao roteamento interdomínios das redes globais, a compartimentação matemática e geométrica dos recursos computacionais atua nas estratégias baseadas nas sub-redes ativas. A adoção irrestrita da estruturação por partições confere escalabilidade sem sacrificar o nível das barreiras relativas aos limites dos isolamentos essenciais de segregação nas matrizes do barramento IP local. Esta formulação das regras processuais baseia-se centralmente na manipulação algébrica profunda contida no coração das máscaras de distribuição e tem funções vitais conjuntas focadas no uso exaustivo e coerente para não desintegrar as esgotadas disponibilidades numéricas remanescentes no ecossistema padronizado de identificação lógica IPv4.
Historicamente compreendido pelas premissas limitadoras do princípio dos sistemas rígidos orientados ao endereçamento "Classful", o agrupamento global efetuava classificações arcaicas que fracionavam as malhas virtuais por octetos rígidos, segmentados com os sufixos restritivos de agrupamento nas Classes A, B, e C (sendo cada uma dotada da rigidez respectiva contida em alocamentos das máscaras delimitadoras fechadas /8, /16 e /24).
A modernização técnica dos paradigmas das interconexões determinou o fim abrupto deste encerramento categórico atrelado aos agrupamentos com o avanço inquestionável atrelado ao conceito inovador contido nas entrelinhas da topologia de redes classless, denominada rigorosamente como Classless Inter-Domain Routing (Roteamento entre Domínios sem Preceitos de Classe - CIDR). O processo reverte a lógica da estrutura contida nas delimitações operacionais inserindo no cenário o princípio intrincado da Máscara de Sub-Rede de Tamanho Variável (VLSM) e as frações matematicamente móveis.
As premissas algébricas fundamentais ditadas nas normas exigem formulações exatas com potências da base numérica elementar estritamente atrelada a dois polos:
A formulação designando os campos exatos de novos barramentos obtidos após o empréstimo base provém do cálculo sistemático: 2^n.
A obtenção real focada na acomodação disponível no ecossistema e computadores úteis operacionais encontra premissas matemáticas na resolução paralela: 2^h - 2.
No âmbito intrínseco aos processos práticos ligados organicamente às abordagens ofensivas da segurança virtual local (cibersegurança), este distanciamento entre blocos modulares restritos através das ferramentas de sub-redes isola integralmente os compartimentos físicos através dos filtros implementados. Os vetores atrelados à reprodução algorítmica associada à injeção local restritiva explorada e as propagações ativas atreladas e condicionadas no espectro do meio das requisições falsificadas e manipulações ARP, sucumbem face à ausência de uma travessia roteável natural dentro daquelas fronteiras estabelecidas.`
  },
  {
    title: "[AULA 7] - Topologias: Star, Mesh, Hybrid — prós e riscos",
    videoUrl: "https://www.youtube.com/watch?v=0m88OuINc1I",
    content: `As disposições inerentes ao delineamento das características logísticas tangíveis atreladas e moldadas pelos arranjos físicos atrelados e subjacentes nas ligações intrínsecas pertinentes aos computadores interligados representam e fundamentam o pilar estruturante e centralmente vital no núcleo contido dos aspectos sistêmicos contidos conceitualmente sob a égide contida referenciada e documentada amplamente pelos projetistas como a formulação e a implementação real contida nos princípios lógicos operacionais das designações de Topologias de Rede.
A estruturação originada na modelagem concentrada em abordagens associadas na conformação estática pertinente à Topologia em Estrela concentra o cerne dos paradigmas logísticos focados ativamente sobre os terminais restritos (e.g. terminais de usuários pontuais locais e agrupamentos atrelados aos nós da Internet das Coisas) atrelados numa dependência de interconexão direta contida aos atributos operacionais radiantes conectados estritamente aos nós localizados rigorosamente numa intersecção de comunicação central limitadora originada e gerida contemporaneamente na interposição do controle ativo efetuada e administrada irrestritamente pela dependência imposta aos modernos dispositivos Switches.
Diametralmente separada nas conceitualizações da fragilidade uníssona pontual dos limitadores e centralizadores e fundamental aos percursos intrincados pioneiros que arquitetaram as contingências iniciais da originária ARPANET contígua , apresenta-se o espectro indissociável de alto padrão focado contido intrincamente na abordagem indissociável aos atributos de comunicação descentralizados contíguos na Topologia em Malha (Mesh Network).
As grandes entidades contemporâneas corporativas adotam, por sua natureza incondicional atrelada à pragmática da realidade da economia digital paralela e da complexidade estrutural, soluções de rede orientadas em abordagens de convergência atreladas invariavelmente nas instâncias derivadas da arquitetura na complexidade imposta inerentemente intersecionada dos padrões da Topologia Híbrida (Hybrid Topology). Neste ínterim, projeta-se o Core de trânsito em nuvem, concebido sob os moldes da Malha, dotando o tráfego centralizador empresarial paralelo da resiliência interligada a provas de perdas das contingências simultâneas extremas limitadas dos grandes volumes de dados.`
  }
];

async function seedCourse() {
  console.log("Iniciando semente de curso...");
  
  // Limpar os antigos para não acumular testes
  await prisma.examAttempt.deleteMany();
  await prisma.finalExam.deleteMany();
  await prisma.video.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();

  // Criar curso base
  const course = await prisma.course.create({
    data: {
      title: "Arquitetura e Fundamentos de Cibersegurança: Redes, Protocolos e Defesa Ativa",
      description: "Curso completo de Redes focado em Cibersegurança.",
      coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800",
      published: true
    }
  });

  // Deferindo a criação de módulos e aulas para o loop
  console.log("Curso base criado.");

  // Criar exame final vazio
  await prisma.finalExam.create({
    data: {
      title: "Teste Final - Redes",
      active: true,
    }
  });

  // Criar módulos e aulas, e chamar a IA
  for (let i = 0; i < lessonsData.length; i++) {
    const data = lessonsData[i];
    const moduleTitle = data.title.replace("[AULA", "[MÓDULO");

    const module = await prisma.module.create({
      data: {
        title: moduleTitle,
        courseId: course.id,
        order: i + 1
      }
    });

    console.log(`Criando módulo e aula ${i+1}/7: ${moduleTitle}...`);
    
    const lesson = await prisma.lesson.create({
      data: {
        moduleId: module.id,
        title: "Conteúdo da Aula",
        content: data.content,
        order: 1,
        videos: {
          create: {
            title: "Vídeo Principal",
            videoId: data.videoUrl, // O videoId será processado pela função regex interna
            provider: "YOUTUBE",
            isPrimary: true
          }
        }
      }
    });

    console.log(`Gerando questões com IA (Lendo YouTube) para: ${data.title}...`);
    try {
      await processLessonForExam(data.title, data.content, data.videoUrl);
      console.log(`✅ Sucesso IA: ${data.title}`);
    } catch(e) {
      console.error(`❌ Erro IA na aula ${data.title}:`, e);
    }
    
    // Pequena pausa para evitar rate limits na API
    await new Promise(r => setTimeout(r, 2000));
  }

  // Atribuir o curso ao aluno
  const student = await prisma.user.findUnique({ where: { email: 'aluno@cyberseg.com' }});
  if (student) {
    await prisma.courseAccess.upsert({
      where: {
        userId_courseId: {
          userId: student.id,
          courseId: course.id
        }
      },
      update: {},
      create: {
        userId: student.id,
        courseId: course.id,
        status: "ACTIVE"
      }
    });
    console.log("Curso liberado para o aluno@cyberseg.com");
  }

  console.log("Todos os dados semeados e IA processada.");
}

seedCourse()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
