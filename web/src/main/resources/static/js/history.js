let currentPage = 0;
const itemsPerPage = 10;

function fetchData(page) {
	currentPage = page; // Update current page
	fetch(`http://localhost:8080/history/data?page=${page}&size=${itemsPerPage}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			// 'Authorization': 'Bearer ' + token // if needed
		},
	})
		.then((response) => response.json())
		.then((data) => {
			console.log(data);

			console.log(data.historyList);
			console.log(data.totalPages);
			console.log(data.historyList.reverse());

			const historyList = data.historyList;
			let html = '';
			historyList.forEach((item) => {
				let result1 = (result2 = class1 = class2 = '');
				if (item.player1Score > item.player2Score) {
					result1 = 'WIN';
					result2 = 'LOSS';
					class1 = 'B2';
					class2 = 'B1';
				} else {
					result2 = 'WIN';
					result1 = 'LOSS';
					class2 = 'B2';
					class1 = 'B1';
				}
				let date = new Date(item.timestamp);

				let options = {
					weekday: 'short',
					year: 'numeric',
					month: 'long',
					day: 'numeric',
					hour: '2-digit',
					minute: '2-digit',
				};

				let formattedDate = date.toLocaleDateString('en-US', options);

				html += `
                <div class="itemMatch">
                <div class="header-match">
                    <span></span>
                    <span>Success 1vs1 Match</span>
                </div>
                <div class="body-match">
                    <div class="time-match">
                        <span>${formattedDate}</span>
                        <span>Round 1</span>
                    </div>
                <div class="result-match">
                    <div class="home">
                        <div class="image-team">
                            <img src="https://play-lh.googleusercontent.com/pnvqAY43TOKv4MR1tQHWdQtxPFp-L0aaxvAX32ftI9UB1BgqOnKOpHP1yM8EkcCQtAGA"
                                alt="" style="width: 100px;height: 100px;border-radius:50%; object-fit: cover;">
                        </div>
                        <div class="info-team">
                            <div class="name-team">${item.player1}</div>

                        </div>
                    </div>
                    <div class="showMatch">
                        <h1 style="text-align: center; margin-bottom: 5px;font-size: 40px;">VS</h1>
                        <p><span class="${class1}">${result1}</span> ${item.player1Score} - ${item.player2Score} <span class="${class2}">${result2}</span></p>
                    </div>
                    <div class="guest">
                        <div class="info-team">
                            <div class="name-team">${item.player2}</div>
                        </div>
                        <div class="image-team">
                            <img src="https://play-lh.googleusercontent.com/pnvqAY43TOKv4MR1tQHWdQtxPFp-L0aaxvAX32ftI9UB1BgqOnKOpHP1yM8EkcCQtAGA"
                                alt="" style="width: 100px;height: 100px;border-radius:50%; object-fit: cover;">
                        </div>
                    </div>
                </div>
                </div>
                </div>
			`;
			});
			html += `<div id="pagination"></div>`;

			document.getElementsByClassName('content')[0].style.display = 'grid';
			document.getElementsByClassName('listMatch')[0].innerHTML = html;
			document.getElementsByClassName('no-data')[0].style.display = 'none';
			const pagination = document.getElementById('pagination');
			// pagination.innerHTML = ''; // Clear previous page links
			const totalPages = data.totalPages;
			for (let i = 0; i < totalPages; i++) {
				const link = document.createElement('button');
				link.textContent = i + 1;
				link.onclick = function () {
					fetchData(i);
				};
				pagination.appendChild(link);
			}
		})
		.catch((error) => {
			console.error('Error:', error);
			document.getElementsByClassName('no-data')[0].style.display = 'grid';
			document.getElementsByClassName('content')[0].style.display = 'none';
		});
}
fetchData(currentPage);
