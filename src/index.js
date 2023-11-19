let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form")
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  toyForm.addEventListener('submit', (event) => {
    event.preventDefault()

    const nameInput = document.querySelector("input[name='name']")
    const imageInput = document.querySelector("input[name='image']")
    const newToy = {
      name: nameInput.value,
      image: imageInput.value,
      likes: 0
    }

    postRequest(newToy)

    nameInput.value = ""
    imageInput.value = ""
  })
});

function createToyCard(element) {
const cards = document.createElement('div')
      cards.classList = 'card'

      const name = document.createElement('h2')
      name.innerText = element.name
      cards.appendChild(name)

      const image = document.createElement('img')
      image.src = element.image
      image.classList = 'toy-avatar'
      cards.appendChild(image)

      const likes = document.createElement('p')
      likes.innerText = `Likes: ${element.likes}`
      likes.id = `likes-${element.id}`
      cards.appendChild(likes)

      const button = document.createElement('button')
      button.classList = 'like-btn'
      button.id = element.id
      button.innerText = 'Like ❤️'
      button.className = element.likes
      cards.appendChild(button)
      button.addEventListener('click', (event) => {
        const currentLikes = parseInt(event.target.className);
        const newLikes = currentLikes + 1
        patchRequest(event, event.target.id, newLikes)
      })

      return cards
}

function getRequest() {
  fetch('http://localhost:3000/toys')
  .then((resp) => resp.json())
  .then(data => {
    const divContainer = document.getElementById('toy-collection')
    divContainer.innerHTML = ''
    data.forEach((element) => {
      const card = createToyCard(element)
      divContainer.appendChild(card)
    })
  })
  .catch(error => {
    console.log('Error:', error)
  })
}

getRequest()

function postRequest(newToy) {
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: 
    {
      "Content-Type": "application/json",
      Accept: "application/json"
    },

    body: JSON.stringify(newToy)
  })
  .then((resp) => resp.json())
  .then((data) => {
    const divContainer = document.getElementById('toy-collection')
    const card = createToyCard(data)
    divContainer.appendChild(card)
  })
  .catch(error => {
    console.log("Error:", error)
  })
}

function patchRequest(event, toyId, newLikes) {
  fetch(`http://localhost:3000/toys/${toyId}`, {
    method: 'PATCH',
    headers: 
    {
      "Content-Type": "application/json",
      Accept: "application/json"
    },

    body: JSON.stringify({
      "likes": newLikes
    })
  })
  .then((resp) => resp.json())
  .then((data) => {
    const likesElement = document.getElementById(`likes-${toyId}`)
    likesElement.textContent = `Likes: ${data.likes}`;
    event.target.className = data.likes
  })
  .catch(error => {
    console.log("Error:", error)
  })
}