const gameForm = document.getElementById('game-form');
const gameList = document.getElementById('game-list');
let currentEditId = null;

// GET
async function getGames() {
    try {
        const response = await fetch('http://localhost:3000/games');
        const games = await response.json();
        gameList.innerHTML = '';

        games.forEach(game => {
            const div = document.createElement('div');
            div.innerHTML = `
                <h3>${game.title}</h3>
                <p>${game.genre} | ${game.platform} | Släppt: ${game.release_date}</p>
                <button onclick="prepareUpdate('${game.id}', '${game.title}', '${game.genre}', '${game.platform}', '${game.release_date}')">Redigera</button>
                <button onclick="deleteGame('${game.id}')">Ta bort</button>
                <hr>
            `;
            gameList.appendChild(div);
        });
    } catch (error) {
        console.error("Kunde inte hämta spel", error);
    }
}

// POST/PUT
gameForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const gameData = {
        title: document.getElementById('title').value,
        genre: document.getElementById('genre').value,
        platform: document.getElementById('platform').value,
        release_date: document.getElementById('release_date').value
    };

    const url = currentEditId ? `http://localhost:3000/games/${currentEditId}` : 'http://localhost:3000/games';
    const method = currentEditId ? 'PUT' : 'POST';

    try {
        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gameData)
        });
        
        currentEditId = null;
        gameForm.reset();
        document.querySelector('#game-form button').textContent = "Spara spel";
        getGames();
    } catch (error) {
        console.error("Fel vid sparande", error);
    }
});

// DELETE
async function deleteGame(id) {
    if (confirm("Vill du ta bort spelet?")) {
        await fetch(`http://localhost:3000/games/${id}`, { method: 'DELETE' });
        getGames();
    }
}


function prepareUpdate(id, title, genre, platform, releaseDate) {
    currentEditId = id;
    document.getElementById('title').value = title;
    document.getElementById('genre').value = genre;
    document.getElementById('platform').value = platform;
    document.getElementById('release_date').value = releaseDate; 
    document.querySelector('#game-form button').textContent = "Uppdatera spel";
}

getGames();

