//Adding an event listener to ensure the DOM is fully loaded before executing the JavaScript
document.addEventListener("DOMContentLoaded", () => {
    
    //Selecting DOM elements by id and assigning them to variables
    const postForm = document.getElementById("postForm");
    const postContent = document.getElementById("postContent");
    const postAuthor = document.getElementById("postAuthor");
    const postTags = document.getElementById("postTags");
    const charCount = document.getElementById("charCount");
    const feed = document.getElementById("feed");
    const search = document.getElementById("search");

    //Retrieving posts from localStorage or initializing an empty array
    //Parsing the JSON response string into a data object
    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    //Arrow function to update character count in the textarea
    const updateCharCount = () => {
        charCount.textContent = `${postContent.value.length}/280`;
    };

    //Adding an event listener for input in the postContent textarea to update character count
    postContent.addEventListener("input", updateCharCount);

    //Arrow function to render posts based on optional filter parameter
    const renderPosts = (filter = "") => {
        //Clears previous content in the feed container
        feed.innerHTML = "";
        //Converting filter text to lowercase so search is case-insensitive
        const lowerCaseFilter = filter.toLowerCase();
        //Filtering posts based on content, tags, or author that includes the filter text
        posts
        .filter(post => 
            //Looking for posts that contain the case-insensitive content, tags, or author
            post.content.toLowerCase().includes(lowerCaseFilter) || 
            post.tags.toLowerCase().includes(lowerCaseFilter) || 
            post.author.toLowerCase().includes(lowerCaseFilter))
        .forEach((post, index) => {
                //Creating a new div element for each new post
                const postElement = document.createElement("div");
                //Adding the post class to the new div for styling and functionality
                postElement.classList.add("post");
                //Adding HTML content for each post
                postElement.innerHTML = `
                    <div class="post-content">${post.content}</div>
                    <div class="post-info">
                        <span>${post.author}</span> | 
                        <span>${post.date}</span> | 
                        <span>${post.tags}</span>
                    </div>
                    <span class="edit" onclick="editPost(${index})">Edit</span>
                    <span class="delete" onclick="deletePost(${index})">Delete</span>
                `;
                //Appending the post element to the feed container
                feed.appendChild(postElement);
            });
    };

    //Adding an event listener for the form submission (posting new content)
    postForm.addEventListener("submit", (e) => {
        //Prevents default form submission
        e.preventDefault();

        //Validating the required fields (content and author)
        if (postContent.value === "" || postAuthor.value === "") {
            //Sending an alert if the content or author fields are blank
            alert("Content and Author are required!");
            return;
        }

        //Creating the new post object
        const newPost = {
            content: postContent.value,
            author: postAuthor.value,
            //Sets the date to the current timestamp
            date: new Date().toLocaleString(),
            tags: postTags.value,
        };

        //Adding a new post to the posts array
        posts.push(newPost);
        //Storing updated posts in localStorage
        localStorage.setItem("posts", JSON.stringify(posts));
        //Rendering posts again after the new post is added
        renderPosts();
        //Resetting the form fields
        postForm.reset();
        //Updating the character count
        updateCharCount();
    });

    //Adding an event listener for the search input to filter posts
    search.addEventListener("input", (e) => {
        //Rendering posts based on the search input value
        renderPosts(e.target.value);
    });

    //Arrow function to edit a specific post identified by index
    window.editPost = (index) => {
        //Getting the post object by index
        const post = posts[index];
        //Updating textarea with post content
        postContent.value = post.content;
        //Updating author input field
        postAuthor.value = post.author;
        //Updating tags input field
        postTags.value = post.tags;
        //Removing original post from the posts array
        posts.splice(index, 1);
        //Updating posts in localStorage and setting as a JSON string
        localStorage.setItem("posts", JSON.stringify(posts));
        //Rendering updated posts
        renderPosts();
        //Updating character count
        updateCharCount();
    };

    //Arrow function to delete a specific post identified by index
    window.deletePost = (index) => {
        //Removing the specific post from the posts array by index
        posts.splice(index, 1);
        //Updating posts in localStorage and setting as a JSON string
        localStorage.setItem("posts", JSON.stringify(posts));
        //Rendering updated posts
        renderPosts();
    };

    //Calling the initial rendering of posts when page is loaded
    renderPosts();
    //Calling the initial update of character count when page is loaded
    updateCharCount();
});