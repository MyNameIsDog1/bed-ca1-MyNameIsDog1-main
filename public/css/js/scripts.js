$(document).ready(() => {
    // Display logged-in user's username
    const username = localStorage.getItem('username');
    if (username) {
        $('#user-info').text(`Logged in as: ${username}`);
    } else {
        $('#user-info').text('Not logged in');
    }

    // Create Pet and Assign Quest
    $('#create-pet-form').on('submit', function (e) {
        e.preventDefault();
        const petData = {
            owner_id: $('#owner_id').val(),
            name: $('#name').val(),
            breed: $('#breed').val(),
            health: 40, // Default health
            happiness: 40 // Default happiness
        };

        $.post('/pets', petData, (response) => {
            const petId = response.pet_id;
            alert(`Pet created with ID: ${petId}`);

            // Show pet video
            $('#pet-video').show();

            // Automatically assign a quest to the new pet
            const questData = {
                pet_id: petId,
                description: 'Initial Quest',
                reward_points: 100
            };

            $.post('/quests', questData, (response) => {
                alert(`Quest created with ID: ${response.quest_id}`);
            }).fail((error) => {
                const message = error.responseJSON ? error.responseJSON.message : 'Unknown error';
                alert(`Error creating quest: ${message}`);
            });

            this.reset();
        }).fail((error) => {
            const message = error.responseJSON ? error.responseJSON.message : 'Unknown error';
            alert(`Error creating pet: ${message}`);
        });
    });

    // Complete Pet Quest
    $('#complete-petquest-form').on('submit', function (e) {
        e.preventDefault();
        const questId = $('#quest_id').val();

        $.ajax({
            url: `/quests/complete/${questId}`,
            type: 'PUT',
            success: (response) => {
                alert(response.message);
                if (response.healthDecrease || response.happinessDecrease) {
                    alert(`Your pet's health decreased by ${response.healthDecrease} and happiness decreased by ${response.happinessDecrease}.`);

                    // Update the health and happiness display
                    const petId = $('#health_happiness_pet_id').val();
                    $.get(`/pets/${petId}/health-happiness`, (response) => {
                        $('#health-happiness').html(`Health: ${response.health}, Happiness: ${response.happiness}`);
                    }).fail((error) => {
                        const message = error.responseJSON ? error.responseJSON.message : 'Unknown error';
                        alert(`Error retrieving health and happiness: ${message}`);
                    });
                }
                this.reset();
            },
            error: (error) => {
                const message = error.responseJSON ? error.responseJSON.message : 'Unknown error';
                alert(`Error completing quest: ${message}`);
            }
        });
    });

    // Feed Pet
    $('.feed-item').on('click', function (e) {
        e.preventDefault();
        const petId = $('#feed_pet_id').val();
        const item = $(this).data('item');

        $.post('/store/feed', { pet_id: petId, item: item }, (response) => {
            alert(response.message);

            // Update the health and happiness display
            $.get(`/pets/${petId}/health-happiness`, (response) => {
                $('#health-happiness').html(`Health: ${response.health}, Happiness: ${response.happiness}`);
            }).fail((error) => {
                const message = error.responseJSON ? error.responseJSON.message : 'Unknown error';
                alert(`Error retrieving health and happiness: ${message}`);
            });
        }).fail((error) => {
            const message = error.responseJSON ? error.responseJSON.message : 'Unknown error';
            alert(`Error feeding pet: ${message}`);
        });
    });

    // Get Pet Store Points
    $('#get-store-points-form').on('submit', function (e) {
        e.preventDefault();
        const petId = $('#pet_id').val();

        $.get(`/pets/${petId}/points`, (response) => {
            $('#store-points').html(`Total Points: ${response.points}`);
        }).fail((error) => {
            const message = error.responseJSON ? error.responseJSON.message : 'Unknown error';
            alert(`Error retrieving points: ${message}`);
        });
    });

    // Buy Item from Store
    $('.buy-item').on('click', function (e) {
        e.preventDefault();
        const petId = $('#store_pet_id').val();
        const item = $(this).data('item');

        $.post(`/store/buy`, { pet_id: petId, item: item }, (response) => {
            alert(response.message);
            $('#purchase-result').html(`You have purchased a ${response.item}. Remaining points: ${response.remainingPoints}`);

            // Update the points displayed
            $.get(`/pets/${petId}/points`, (response) => {
                $('#store-points').html(`Total Points: ${response.points}`);
            }).fail((error) => {
                const message = error.responseJSON ? error.responseJSON.message : 'Unknown error';
                alert(`Error retrieving points: ${message}`);
            });

            this.reset();
        }).fail((error) => {
            const message = error.responseJSON ? error.responseJSON.message : 'Unknown error';
            alert(`Error purchasing item: ${message}`);
        });
    });

    // Get Pet Health and Happiness
    $('#get-health-happiness-form').on('submit', function (e) {
        e.preventDefault();
        const petId = $('#health_happiness_pet_id').val();

        $.get(`/pets/${petId}/health-happiness`, (response) => {
            $('#health-happiness').html(`Health: ${response.health}, Happiness: ${response.happiness}`);
        }).fail((error) => {
            const message = error.responseJSON ? error.responseJSON.message : 'Unknown error';
            alert(`Error retrieving health and happiness: ${message}`);
        });
    });
});
