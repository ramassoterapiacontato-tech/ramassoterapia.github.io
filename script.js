document.getElementById('formAgendamento').addEventListener('submit', function(e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const servico = document.getElementById('servico').value;
  const data = document.getElementById('data').value;

  // Converte a data do formato YYYY-MM-DD para DD/MM/YYYY
  const dataFormatada = data.split('-').reverse().join('/');

  // Coloque o número do WhatsApp da dona aqui (apenas números com DDD, ex: 5511999999999)
  const numeroWhats = "5512991836724";

  const texto = `Olá, *Ra Massoterapia*! Gostaria de solicitar um agendamento.\n\n` +
                `*Nome:* ${nome}\n` +
                `*Serviço:* ${servico}\n` +
                `*Data Desejada:* ${dataFormatada}`;

  window.open(`https://wa.me/${numeroWhats}?text=${encodeURIComponent(texto)}`, '_blank');
});