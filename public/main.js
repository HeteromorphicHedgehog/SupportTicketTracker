const ticketForm = document.getElementById('ticket-form');
const ticketList = document.getElementById('ticket-list');
const filterSelect = document.getElementById('filter');

async function fetchTickets() {
  const response = await fetch('/api/tickets');
  return await response.json();
}

async function addTicket(title, description) {
  const response = await fetch('/api/tickets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description }),
  });
  return await response.json();
}

async function toggleTicketStatus(id) {
  const response = await fetch(`/api/tickets/${id}`, {
    method: 'PUT',
  });
  return await response.json();
}

async function renderTickets() {
  const tickets = await fetchTickets();
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
      <button onclick="handleToggleStatus(${ticket.id})">
        ${ticket.status === 'open' ? 'Resolve' : 'Reopen'}
      </button>
    </li>
  `).join('');
}

ticketForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('ticket-title').value;
  const description = document.getElementById('ticket-description').value;
  await addTicket(title, description);
  ticketForm.reset();
  renderTickets();
});

filterSelect.addEventListener('change', renderTickets);

async function handleToggleStatus(id) {
  await toggleTicketStatus(id);
  renderTickets();
}

window.handleToggleStatus = handleToggleStatus;

renderTickets();