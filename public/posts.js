document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.getElementById('posts-container');
    console.log('Posts script executed');
    fetch('http://localhost:3000/posts')
        .then(response => response.json())
        .then(posts => {
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.innerHTML = `
                    <h2>${post.post_id}</h2>
                    <p>${post.content}</p>
                    
                `;
                postsContainer.appendChild(postElement);
            });
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
        });
});
