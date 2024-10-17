let tickets = JSON.parse(localStorage.getItem('tickets')) || [];

const ticketForm = document.getElementById('ticket-form');
const ticketList = document.getElementById('ticket-list');
const filterSelect = document.getElementById('filter');

function saveTickets() {
  localStorage.setItem('tickets', JSON.stringify(tickets));
}

function addTicket(title, description) {
  const newTicket = {
    id: Date.now(),
    title,
    description,
    status: 'open',
    createdAt: new Date().toLocaleString()
  };
  tickets.push(newTicket);
  saveTickets();
  renderTickets();
}

function toggleTicketStatus(id) {
  const ticket = tickets.find(t => t.id === id);
  if (ticket) {
    ticket.status = ticket.status === 'open' ? 'resolved' : 'open';
    saveTickets();
    renderTickets();
  }
}

function renderTickets() {
  const filter = filterSelect.value;
  const filteredTickets = filter === 'all' 
    ? tickets 
    : tickets.filter(t => t.status === filter);

  ticketList.innerHTML = filteredTickets.map(ticket => `
    <li class="ticket ${ticket.status}">
      <h3>${ticket.title}</h3>
      <p>${ticket.description}</p>
      <p>Status: ${ticket.status}</p>
      <p>Created: ${ticket.createdAt}</p>
      <button onclick="toggleTicketStatus(${ticket.id})">
        ${ticket.status === 'open' ? 'Resolve' : 'Reopen'}
      </button>
    </li>
  `).join('');
}

ticketForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('ticket-title').value;
  const description = document.getElementById('ticket-description').value;
  addTicket(title, description);
  ticketForm.reset();
});

filterSelect.addEventListener('change', renderTickets);

window.toggleTicketStatus = toggleTicketStatus;

renderTickets();