document.addEventListener("DOMContentLoaded", () => {
    const postForm = document.getElementById("postForm");
    const postContent = document.getElementById("postContent");
    const postAuthor = document.getElementById("postAuthor");
    const postTags = document.getElementById("postTags");
    const charCount = document.getElementById("charCount");
    const feed = document.getElementById("feed");
    const search = document.getElementById("search");

    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    const updateCharCount = () => {
        charCount.textContent = `${postContent.value.length}/280`;
    };

    postContent.addEventListener("input", updateCharCount);

    const renderPosts = (filter = "") => {
        feed.innerHTML = "";
        posts
            .filter(post => post.content.includes(filter) || post.tags.includes(filter))
            .forEach((post, index) => {
                const postElement = document.createElement("div");
                postElement.classList.add("post");
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
                feed.appendChild(postElement);
            });
    };

    postForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (postContent.value === "" || postAuthor.value === "") {
            alert("Content and Author are required!");
            return;
        }

        const newPost = {
            content: postContent.value,
            author: postAuthor.value,
            date: new Date().toLocaleString(),
            tags: postTags.value,
        };

        posts.push(newPost);
        localStorage.setItem("posts", JSON.stringify(posts));
        renderPosts();
        postForm.reset();
        updateCharCount();
    });

    search.addEventListener("input", (e) => {
        renderPosts(e.target.value);
    });

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

    window.deletePost = (index) => {
        posts.splice(index, 1);
        localStorage.setItem("posts", JSON.stringify(posts));
        renderPosts();
    };

    renderPosts();
    updateCharCount();
});
