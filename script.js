document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const body = document.body;

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-theme');
            themeToggleButton.textContent = 'Switch to Light Theme';
        } else {
            body.classList.remove('dark-theme');
            themeToggleButton.textContent = 'Switch to Dark Theme';
        }
    };

    // Load saved theme from local storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Default to light theme if no preference is saved
        applyTheme('light');
    }

    themeToggleButton.addEventListener('click', () => {
        let currentTheme;
        if (body.classList.contains('dark-theme')) {
            // Switch to light theme
            body.classList.remove('dark-theme');
            themeToggleButton.textContent = 'Switch to Dark Theme';
            currentTheme = 'light';
        } else {
            // Switch to dark theme
            body.classList.add('dark-theme');
            themeToggleButton.textContent = 'Switch to Light Theme';
            currentTheme = 'dark';
        }
        localStorage.setItem('theme', currentTheme);
    });

    // Logic for displaying concert cards
    const concertGrid = document.getElementById('concert-grid');

    function displayConcerts(concertArray) {
        if (!concertGrid) {
            console.error("Concert grid not found!");
            return;
        }
        if (!concertArray || concertArray.length === 0) {
            concertGrid.innerHTML = '<p>No concerts available at the moment.</p>';
            return;
        }

        concertGrid.innerHTML = ''; // Clear existing content (e.g., "Loading concerts...")

        concertArray.forEach(concert => {
            const card = document.createElement('div');
            card.className = 'concert-card'; // Use the class defined in style.css

            card.innerHTML = `
                <img src="${concert.image}" alt="${concert.name}">
                <div class="concert-card-content">
                    <h3>${concert.name}</h3>
                    <p class="category">Category: ${concert.category}</p>
                    <p class="date-venue">Date: ${concert.date} | Venue: ${concert.venue}</p>
                    <p class="price">Price: ${concert.price}</p>
                    <a href="#" class="btn-details" data-concert-id="${concert.id}">View Details</a>
                </div>
            `;
            concertGrid.appendChild(card);
        });
    }

    // Assuming 'concerts' is globally available from concert_data.js
    if (typeof concerts !== 'undefined') {
        displayConcerts(concerts);
    } else {
        console.error('Concert data is not loaded.');
        if (concertGrid) {
            concertGrid.innerHTML = '<p>Error loading concert data.</p>';
        }
    }

    // Category filter logic
    const categoryFilter = document.getElementById('category-filter');

    if (categoryFilter && typeof concerts !== 'undefined') {
        categoryFilter.addEventListener('change', (event) => {
            const selectedCategory = event.target.value;
            let filteredConcerts;

            if (selectedCategory === 'all') {
                filteredConcerts = concerts; // Use the original full list
            } else {
                filteredConcerts = concerts.filter(concert => concert.category === selectedCategory);
            }
            displayConcerts(filteredConcerts);
        });
    } else {
        if (!categoryFilter) console.error("Category filter dropdown not found!");
        // Error for 'concerts' undefined is handled by the initial display logic
    }

    // Event delegation for "View Details" buttons
    if (concertGrid) {
        concertGrid.addEventListener('click', function(event) {
            // Check if the clicked element is a 'View Details' button
            if (event.target.classList.contains('btn-details')) {
                event.preventDefault(); // Prevent default anchor behavior if href="#"

                const concertId = event.target.getAttribute('data-concert-id');
                if (concertId) {
                    // Navigate to the detail page with the concert ID as a query parameter
                    window.location.href = `concert_detail.html?id=${concertId}`;
                } else {
                    console.error('Concert ID not found on the button.');
                }
            }
        });
    }

    // --- Logic for Concert Detail Page ---
    const concertDetailMain = document.getElementById('concert-detail-main');

    if (concertDetailMain && typeof concerts !== 'undefined') { // Check if on detail page and data exists
        const urlParams = new URLSearchParams(window.location.search);
        const concertIdParam = urlParams.get('id');

        if (concertIdParam) {
            const concertId = parseInt(concertIdParam, 10);
            const concert = concerts.find(c => c.id === concertId);

            if (concert) {
                document.title = `${concert.name} - ConcertGo`; // Update page title

                // Populate placeholders
                const nameEl = document.getElementById('detail-concert-name');
                const imageEl = document.getElementById('detail-concert-image');
                const categoryEl = document.getElementById('detail-concert-category');
                const datetimeEl = document.getElementById('detail-concert-datetime'); // Assuming 'date' field for now
                const venueEl = document.getElementById('detail-concert-venue');
                const priceEl = document.getElementById('detail-concert-price');
                const descriptionEl = document.getElementById('detail-concert-description');
                const addToCartButton = document.getElementById('add-to-cart-button');

                if (nameEl) nameEl.textContent = concert.name;
                if (imageEl) {
                    imageEl.src = concert.image;
                    imageEl.alt = concert.name;
                }
                if (categoryEl) categoryEl.textContent = concert.category;
                // For datetime, you might want to format it or if you have separate date/time fields
                if (datetimeEl) datetimeEl.textContent = concert.date; // Using concert.date for now
                if (venueEl) venueEl.textContent = concert.venue;
                if (priceEl) priceEl.textContent = concert.price;
                // For description, if you add a longer description field to your data later
                if (descriptionEl) descriptionEl.textContent = `This is a detailed description for ${concert.name}. More information about the event, artists, and what to expect. For now, we are using a placeholder image from: ${concert.image}. The event is a ${concert.category} type.`;


                if (addToCartButton) {
                    // Store concert ID on the button for easy access when adding to cart
                    addToCartButton.setAttribute('data-concert-id', concert.id);

                    // Add to Cart button event listener
                    addToCartButton.addEventListener('click', function() {
                        const concertIdStr = this.getAttribute('data-concert-id');
                        if (!concertIdStr) {
                            alert('Could not add to cart. Concert ID missing.');
                            return;
                        }
                        const concertId = parseInt(concertIdStr, 10);
                        // We already have 'concert' object in the outer scope, let's use it.
                        // const clickedConcert = concerts.find(c => c.id === concertId);

                        if (concert) { // Use the 'concert' from the outer scope
                            let cart = JSON.parse(localStorage.getItem('cart')) || [];

                            const existingItem = cart.find(item => item.id === concert.id);

                            if (existingItem) {
                                alert(`${concert.name} is already in your cart.`);
                            } else {
                                cart.push({
                                    id: concert.id,
                                    name: concert.name,
                                    price: concert.price,
                                    image: concert.image,
                                    quantity: 1
                                });
                                localStorage.setItem('cart', JSON.stringify(cart));
                                
                                this.textContent = 'Added to Cart!';
                                this.disabled = true;
                                setTimeout(() => {
                                    this.textContent = 'Add to Cart';
                                    this.disabled = false;
                                }, 2000);
                            }
                        } else {
                            alert('Error: Concert details not found for adding to cart.');
                        }
                    });
                }

            } else {
                // Concert with the given ID not found
                if (document.getElementById('detail-concert-name')) {
                     document.getElementById('detail-concert-name').textContent = 'Concert Not Found';
                }
                const detailContent = document.getElementById('concert-detail-content');
                if (detailContent) {
                     detailContent.innerHTML = '<p>Sorry, the concert you are looking for could not be found. Please check the ID or go back to the <a href="index.html">home page</a>.</p>';
                }
            }
        } else {
            // No ID in URL
            if (document.getElementById('detail-concert-name')) {
                document.getElementById('detail-concert-name').textContent = 'Invalid Concert URL';
            }
             const detailContent = document.getElementById('concert-detail-content');
             if (detailContent) {
                detailContent.innerHTML = '<p>No concert ID provided. Please go back to the <a href="index.html">home page</a> and select a concert.</p>';
             }
        }
    }
    // --- End of Logic for Concert Detail Page ---
});
