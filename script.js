const SUPABASE_URL = 'https://gockrjvblzgjmlvicsrs.supabase.co';
const SUPABASE_KEY = 'sb_publishable_M8oKEVy-HriQ_HpxgF251Q_Xp_2Uqu5';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const formAgendamento = document.getElementById('formAgendamento');
const campoData = document.getElementById('data');
const campoHorario = document.getElementById('horario');
const horariosDisponiveis = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
];

function preencherHorarios(horariosOcupados = []) {
  const ocupados = new Set(horariosOcupados);
  campoHorario.replaceChildren();

  const opcaoPadrao = new Option('Selecione o horário...', '', true, true);
  opcaoPadrao.disabled = true;
  campoHorario.add(opcaoPadrao);

  horariosDisponiveis.forEach((horario) => {
    const ocupado = ocupados.has(horario);
    const opcao = new Option(
      ocupado ? `${horario} (Ocupado / Reservado)` : horario,
      horario
    );
    opcao.disabled = ocupado;
    campoHorario.add(opcao);
  });

  campoHorario.disabled = false;
}

async function carregarHorarios(data) {
  campoHorario.disabled = true;
  campoHorario.replaceChildren(
    new Option('Carregando horários...', '', true, true)
  );

  const { data: agendamentos, error } = await _supabase
    .from('agendamentos')
    .select('horario')
    .eq('data', data);

  if (error) {
    campoHorario.replaceChildren(
      new Option('Não foi possível carregar os horários', '', true, true)
    );
    alert('Não foi possível consultar os horários. Tente novamente.');
    return false;
  }

  preencherHorarios(
    agendamentos.map((agendamento) => String(agendamento.horario).slice(0, 5))
  );
  return true;
}

campoData.addEventListener('change', () => {
  if (campoData.value) {
    carregarHorarios(campoData.value);
  }
});

formAgendamento.addEventListener('submit', async (event) => {
  event.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const servico = document.getElementById('servico').value;
  const data = campoData.value;
  const horario = campoHorario.value;
  const valor = servico.startsWith('Combo 4 sessões') ? 'R$ 500,00' : 'R$ 150,00';

  if (!data || !horario || campoHorario.disabled) {
    alert('Selecione uma data e um horário disponível.');
    return;
  }

  const botao = formAgendamento.querySelector('button[type="submit"]');
  botao.disabled = true;

  const { error } = await _supabase
    .from('agendamentos')
    .insert({ nome, servico, data, horario });

  if (error) {
    botao.disabled = false;
    alert('Esse horário acabou de ser reservado. Escolha outro horário.');
    await carregarHorarios(data);
    return;
  }

  const dataFormatada = data.split('-').reverse().join('/');
  const numeroWhats = '5512991836724';
  const texto = `Olá, *Ra Massoterapia*! Gostaria de solicitar um agendamento.\n\n` +
    `*Nome:* ${nome}\n` +
    `*Serviço:* ${servico}\n` +
    `*Valor:* ${valor}\n` +
    `*Data:* ${dataFormatada}\n` +
    `*Horário:* ${horario}`;

  window.open(`https://wa.me/${numeroWhats}?text=${encodeURIComponent(texto)}`, '_blank');
  await carregarHorarios(data);
  botao.disabled = false;
});