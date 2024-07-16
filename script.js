document.getElementById('postForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const postContent = document.getElementById('postContent').value;
    const postAuthor = document.getElementById('postAuthor').value;
    const postTags = document.getElementById('postTags').value;
    const postImage = document.getElementById('postImage').files[0];
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const newPost = document.createElement('div');
        newPost.classList.add('post');

        let imageHTML = '';
        if (postImage) {
            imageHTML = `<img src="${e.target.result}" alt="Post Image" class="post-image">`;
        }

        newPost.innerHTML = `
            <div class="post-content">${postContent}</div>
            ${imageHTML}
            <div class="post-info">
                <span>Author: ${postAuthor}</span><br>
                <span>Tags: ${postTags}</span>
            </div>
            <span class="edit">Edit</span>
            <span class="delete">Delete</span>
        `;

        document.getElementById('feed').prepend(newPost);

        // Clear form fields
        document.getElementById('postContent').value = '';
        document.getElementById('postAuthor').value = '';
        document.getElementById('postTags').value = '';
        document.getElementById('postImage').value = '';
        document.getElementById('charCount').textContent = '0/280';
    }

    if (postImage) {
        reader.readAsDataURL(postImage);
    } else {
        reader.onload();
    }
});


