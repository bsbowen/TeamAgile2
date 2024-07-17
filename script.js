document.addEventListener("DOMContentLoaded", () => {
    // Selecting DOM elements by id and assigning them to variables
    const postForm = document.getElementById("postForm");
    const postContent = document.getElementById("postContent");
    const postAuthor = document.getElementById("postAuthor");
    const postTags = document.getElementById("postTags");
    const charCount = document.getElementById("charCount");
    const feed = document.getElementById("feed");
    const search = document.getElementById("search");
    const imageInput = document.getElementById("imageInput");

    // Retrieving posts from localStorage or initializing an empty array
    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    // Arrow function to update character count in the textarea
    const updateCharCount = () => {
        charCount.textContent = `${postContent.value.length}/280`;
    };

    // Adding an event listener for input in the postContent textarea to update character count
    postContent.addEventListener("input", updateCharCount);

    // Arrow function to render posts based on optional filter parameter
    const renderPosts = (filter = "") => {
        // Clears previous content in the feed container
        feed.innerHTML = "";
        // Converting filter text to lowercase so search is case-insensitive
        const lowerCaseFilter = filter.toLowerCase();
        // Filtering posts based on content, tags, or author that includes the filter text
        posts
            .filter(post =>
                post.content.toLowerCase().includes(lowerCaseFilter) ||
                post.tags.toLowerCase().includes(lowerCaseFilter) ||
                post.author.toLowerCase().includes(lowerCaseFilter))
            .forEach((post, index) => {
                // Creating a new div element for each new post
                const postElement = document.createElement("div");
                // Adding the post class to the new div for styling and functionality
                postElement.classList.add("post");
                // Adding HTML content for each post
                postElement.innerHTML = `
                    <div class="post-content">${post.content}</div>
                    ${post.image ? `<img src="${post.image}" alt="Post Image" class="post-image">` : ''}
                    <div class="post-info">
                        <span>${post.author}</span> | 
                        <span>${post.date}</span> | 
                        <span>${post.tags}</span>
                    </div>
                    <button class="like" onclick="toggleLike(${index})">Like (${post.likes})</button>
                    <button class="dislike" onclick="toggleDislike(${index})">Dislike (${post.dislikes})</button>
                    <span class="edit" onclick="editPost(${index})">Edit</span>
                    <span class="delete" onclick="deletePost(${index})">Delete</span>
                `;
                // Appending the post element to the feed container
                feed.appendChild(postElement);
            });
    };

    // Adding an event listener for the form submission (posting new content)
    postForm.addEventListener("submit", async (e) => {
        // Prevents default form submission
        e.preventDefault();

        // Validating the required fields (content and author)
        if (postContent.value === "" || postAuthor.value === "") {
            alert("Content and Author are required!");
            return;
        }

        // Check if an image file was selected
        let imageBase64 = "";
        
        if (imageInput.files && imageInput.files[0]) {
            // Read the selected image file
            const file = imageInput.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            // Convert the image to base64 string asynchronously
            imageBase64 = await new Promise((resolve) => {
                reader.onloadend = () => resolve(reader.result);
            });
        }

        // Creating the new post object
        const newPost = {
            content: postContent.value,
            author: postAuthor.value,
            date: new Date().toLocaleString(),
            tags: postTags.value,
            image: imageBase64, // Store the base64 image string
            likes: 0,
            dislikes: 0
        };

        // Adding a new post to the posts array
        posts.push(newPost);
        // Storing updated posts in localStorage
        localStorage.setItem("posts", JSON.stringify(posts));
        // Rendering posts again after the new post is added
        renderPosts();
        // Resetting the form fields
        postForm.reset();
        // Updating the character count
        updateCharCount();
    });

    // Adding an event listener for the search input to filter posts
    search.addEventListener("input", (e) => {
        renderPosts(e.target.value);
    });

    // Arrow function to edit a specific post identified by index
    window.editPost = (index) => {
        const post = posts[index];
        postContent.value = post.content;
        postAuthor.value = post.author;
        postTags.value = post.tags;
        posts.splice(index, 1);
        localStorage.setItem("posts", JSON.stringify(posts));
        renderPosts();
        updateCharCount();
    };

    // Arrow function to delete a specific post identified by index
    window.deletePost = (index) => {
        posts.splice(index, 1);
        localStorage.setItem("posts", JSON.stringify(posts));
        renderPosts();
    };

    // Toggle Like function
    window.toggleLike = (index) => {
        const post = posts[index];
        if (post.likeState === "liked") {
            post.likes -= 1;
            post.likeState = "neutral";
        } else {
            post.likes += 1;
            post.likeState = "liked";
            post.dislikes = 0; // Ensure dislikes are reset when liking
        }
        localStorage.setItem("posts", JSON.stringify(posts));
        renderPosts();
    };

    // Toggle Dislike function
    window.toggleDislike = (index) => {
        const post = posts[index];
        if (post.likeState === "disliked") {
            post.dislikes -= 1;
            post.likeState = "neutral";
        } else {
            post.dislikes += 1;
            post.likeState = "disliked";
            post.likes = 0; // Ensure likes are reset when disliking
        }
        localStorage.setItem("posts", JSON.stringify(posts));
        renderPosts();
    };

    // Initialize likeState for existing posts
    posts.forEach(post => {
        post.likeState = "neutral"; // Neutral state initially
    });

    // Toggle Read more/less function
    window.toggleReadMore = (button) => {
        const moreText = button.previousElementSibling;
        if (moreText.style.display === "none") {
            moreText.style.display = "inline";
            button.parentNode.appendChild(button); // Move button to bottom
            button.textContent = "Read less";
        } else {
            moreText.style.display = "none";
            button.textContent = "Read more";
        }
    };

    // Calling the initial rendering of posts when page is loaded
    renderPosts();
    updateCharCount();
});
