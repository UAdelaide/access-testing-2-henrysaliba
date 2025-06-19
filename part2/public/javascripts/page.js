let posts = [];
let search = null;

/*
 * Hides the main part of the page to show the Ask a Question section
 */
function showAsk(){
    var main = document.getElementById("main");
    var ask = document.getElementById("ask");
    main.style.display = "none";
    ask.style.display = "block";
}

/*
 * Hides the Ask a Question section of the page to show the main part,
 * clearing the question input fields.
 */
function showMain(){
    var main = document.getElementById("main");
    var ask = document.getElementById("ask");
    ask.style.display = "none";
    main.style.display = "block";

    document.getElementById('post-title').value = '';
    document.getElementById('post-content').value = '';
    document.getElementById('post-tags').value = '';
}

/*
 * Creates a new question/post & send it to the server, before triggering an update for the main part of the page.
 */
function createPost(){

    search = null;

    let post = {
        title: document.getElementById('post-title').value,
        content: document.getElementById('post-content').value,
        tags: document.getElementById('post-tags').value.split(" "),
        upvotes: 0
    };

    // Create AJAX Request
    var xmlhttp = new XMLHttpRequest();

    // Define function to run on response
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status == 200) {
            // Update the page on success
            loadPosts();
            showMain();
        }
    };

    // Open connection to server & send the post data using a POST request
    // We will cover POST requests in more detail in week 8
    xmlhttp.open("POST", "/addpost", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(post));

}

/*
 * Updates the search term then reloads the posts shown
 */
function searchPosts(){

    search = document.getElementById('post-search').value.toUpperCase();
    updatePosts();

}


/*
 * Reloads the posts shown on the page
 * Iterates over the array of post objects, rendering HTML for each and appending it to the page
 * If a search term is being used
 */
function updatePosts() {

    // Reset the page
    document.getElementById('post-list').innerHTML = '';

    // Iterate over each post in the array by index
    for(let i=0; i<posts.length; i++){

        let post = posts[i];

        // Check if a search term used.
        if(search !== null){
            // If so, skip this question/post if title or content doesn't match
            if (post.title.toUpperCase().indexOf(search) < 0 &&
                post.content.toUpperCase().indexOf(search) < 0 ) {
                continue;
            }
        }

        // Generate the post/question element and populate it safely
        const postDiv = document.createElement("div");
        postDiv.classList.add("post");

        // Create the votes section
        const votesDiv = document.createElement("div");
        votesDiv.classList.add("votes");

        const upBtn = document.createElement("button");
        upBtn.textContent = "+";
        upBtn.onclick = () => upvote(i);

        const voteText = document.createElement("p");
        voteText.innerHTML = `<span class="count">${post.upvotes}</span><br />votes`;

        const downBtn = document.createElement("button");
        downBtn.textContent = "-";
        downBtn.onclick = () => downvote(i);

        votesDiv.appendChild(upBtn);
        votesDiv.appendChild(voteText);
        votesDiv.appendChild(downBtn);

        // Create the content section
        const contentDiv = document.createElement("div");
        contentDiv.classList.add("content");

        const title = document.createElement("h3");
        const titleLink = document.createElement("a");
        titleLink.href = "#";
        titleLink.textContent = post.title;
        title.appendChild(titleLink);

        const author = document.createElement("i");
        author.textContent = `By ${post.author}`;

        const body = document.createElement("p");
        body.textContent = post.content;

        const date = document.createElement("span");
        date.classList.add("date");
        date.textContent = new Date(post.timestamp).toLocaleString();

        // Append tags
        for (const tag of post.tags) {
            const tagSpan = document.createElement("span");
            tagSpan.classList.add("tag");
            tagSpan.textContent = tag;
            contentDiv.appendChild(tagSpan);
        }

        contentDiv.appendChild(title);
        contentDiv.appendChild(author);
        contentDiv.appendChild(body);
        contentDiv.appendChild(date);

        postDiv.appendChild(votesDiv);
        postDiv.appendChild(contentDiv);

        // Append to the page
        document.getElementById("post-list").appendChild(postDiv);

    }


}

/*
 * Loads posts from the server
 * - Send an AJAX GET request to the server
 * - JSON Array of posts sent in response
 * - Update the
 */
function loadPosts() {

    // Create AJAX Request
    var xmlhttp = new XMLHttpRequest();

    // Define function to run on response
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status == 200) {
            // Parse the JSON and update the posts array
            posts = JSON.parse(this.responseText);
            // Call the updatePosts function to update the page
            updatePosts();
        }
    };

    // Open connection to server
    xmlhttp.open("GET", "/posts", true);

    // Send request
    xmlhttp.send();

}


/*
 * Increase the votes for a given post, then update the page
 */
function upvote(index) {
    posts[index].upvotes ++;
    updatePosts();
}

/*
 * Decrease the votes for a given post, then update the page
 */
function downvote(index) {
    posts[index].upvotes --;
    updatePosts();
}


function login(){

    let user = {
        user: document.getElementById('username').value,
        pass: document.getElementById('password').value
    };

    // Create AJAX Request
    var xmlhttp = new XMLHttpRequest();

    // Define function to run on response
    xmlhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status == 200) {
            alert("Welcome "+this.responseText);
        } else if (this.readyState === 4 && this.status >= 400) {
            alert("Login failed");
        }
    };

    // Open connection to server & send the post data using a POST request
    // We will cover POST requests in more detail in week 8
    xmlhttp.open("POST", "/users/login", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(JSON.stringify(user));

}

function logout(){

    // Create AJAX Request
    var xmlhttp = new XMLHttpRequest();

    // Open connection to server & send the post data using a POST request
    xmlhttp.open("POST", "/users/logout", true);
    xmlhttp.send();

}

window.addEventListener('DOMContentLoaded', loadPosts);
