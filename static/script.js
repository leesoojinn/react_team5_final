//요소 등록
const nav = document.querySelector('nav'); //nav 요소 등록
const modal = document.querySelector('modal1'); // 모달1 요소 등록
const backdrop = document.querySelector('.backdrop'); // 백드롭 요소 선택
const write = document.getElementById('write'); //작성하기 버튼 등록
const modal2 = document.querySelector('modal2'); //모달2 요소 등록
const modal2Send = document.getElementById('modal2Send'); //모달2 보내기 요소 등록
const modal2Close = document.getElementById('modal2Close'); //모달2 닫기 요소 등록
const footer = document.querySelector('footer'); //footer 요소 등록
//
//로고에 애니메이션 주기
function animateLogo() {
    const logo = document.getElementById('logo');
    logo.style.transform = `scale(1.1)`;
    logo.style.transition = 'ease-out 1s';
    let scale = 1;

    setInterval(() => {
        scale = scale === 0.9 ? 1.1 : 0.9;
        logo.style.transform = `scale(${scale})`;
        logo.style.transition = 'ease-out 2s';
    }, 2000);
}
animateLogo();
// smooth scroll
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth' });
}
//스크롤 위치 감지하여 내비탭 효과
window.addEventListener('scroll', function () {
    const posY = this.window.pageYOffset;
    const team = this.document
        .querySelector('#sect1')
        .getBoundingClientRect().top;
    const people = this.document
        .querySelector('#sect2')
        .getBoundingClientRect().top;
    const message = this.document
        .querySelector('#sect3')
        .getBoundingClientRect().top;

    const teamTop = posY + team;
    const peopleTop = posY + people;
    const messageTop = posY + message;

    let NavTeam = document.querySelector('.n-team');
    let NavPeople = document.querySelector('.n-people');
    let NavMessage = document.querySelector('.n-message');

    let totalHeight = document.body.scrollHeight - this.window.innerHeight - 1;

    if (posY > teamTop && posY < peopleTop) {
        NavTeam.classList.add('focus');
        NavPeople.classList.remove('focus');
    } else if (posY >= peopleTop && posY < messageTop) {
        NavTeam.classList.remove('focus');
        NavPeople.classList.add('focus');
        NavMessage.classList.remove('focus');
    } else if (posY >= messageTop && posY <= totalHeight) {
        NavPeople.classList.remove('focus');
        NavMessage.classList.add('focus');
    } else {
    }
});

// nav창 및 로고 드래그 불가능하게 하기
nav.addEventListener('mousedown', function (event) {
    event.preventDefault();
});
footer.addEventListener('mousedown', function (event) {
    event.preventDefault();
});
const modal1photo = document.querySelector('#modal1-img');
modal1photo.addEventListener('mousedown', function (event) {
    event.preventDefault();
});
const peoplePhoto = document.querySelectorAll('.people-card-profile-photo');
peoplePhoto.forEach((photo) => {
    photo.addEventListener('mousedown', (e) => {
        e.preventDefault();
    });
});
const modal1con = document.querySelector('.modal-container');
modal1con.addEventListener('mousedown', function (event) {
    event.preventDefault();
});
// 로딩 화면 표시 함수
function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}
// 로딩 화면 숨김 함수
// 로딩화면 일부러 1초 보이기
function hideLoading() {
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 300);
    modal.classList.toggle('hide');
    modal2.classList.toggle('hide');
}
// 페이지 로딩이 완료되면 로딩 화면 숨김
window.addEventListener('load', hideLoading);

//모달1 열기 함수
function modal1open() {
    modal.classList.toggle('hide'); //모달1 창 보이게하기
    backdrop.classList.toggle('hide'); //어두운 배경화면 보이게 하기
    modal.style.position = 'relative'; //모달1 창을 backdrop위에 위치시키기
    modal.classList.add('lightbox-fade-in'); //fade in 효과 주기
}
// 모달1 닫기 버튼 클릭 이벤트 등에 closeModal 함수를 연결하여 모달 창을 닫을 수 있도록 설정
const peopleModalClose = document.getElementById('people-modal-close');
peopleModalClose.addEventListener('click', () => {
    modal.classList.toggle('hide'); //모달1 숨김
    backdrop.classList.toggle('hide'); // 백드롭 숨김
});

// 모달 닫기 버튼 클릭 이벤트 등에 closeModal2 함수를 연결하여 모달 창을 닫을 수 있도록 설정
modal2Close.addEventListener('click', () => {
    modal2.classList.toggle('hide');
    backdrop.classList.toggle('hide'); // 백드롭 숨김
});

//모달2 열기 함수
write.addEventListener('click', () => {
    modal2.classList.toggle('hide'); //모달2 창 보이게하기
    backdrop.classList.toggle('hide'); //어두운 배경화면 보이게 하기
    modal2.style.position = 'relative'; //모달2 창을 backdrop위에 위치시키기
    modal2.classList.add('lightbox-fade-in'); //fade in 효과 주기
});

// 여기부터는 app.py 배운거 몽고 DB와 연결

$(document).ready(function () {
    listing();
});
modal2Send.addEventListener('click', posting);

function listing() {
    fetch('/userinfo')
        .then((res) => res.json())
        .then((data) => {
            let userData = data.users;
            // get으로 카드 생성할때 수정하기 버튼에 몽고db 고유 id 값을 속성에 넣기
            let _id = userData._id;
            let to_value = document.getElementById('dropdown1').value;
            let from_value = document.getElementById('dropdown2').value;
            let content_value =
                document.getElementById('messageTextArea').textContent;
            userData.forEach((element) => {
                to_value = element.to;
                from_value = element.from;
                content_value = element.content;
                $('#message-card-container').append(`
                <div class="card message-card">
                <div class="message-card-first-div">
                    <p class="message-card-p1">To.</p>
                    <p class="message-card-p1">${to_value}</p>
                    <div>
                        <input class="modal2Edit" type="button" value="수정" _id="${_id}" onclick="edit_post_by_id('${element.id}')">
                        <input class="modal2Delete" type="button" value="삭제" onclick="delete_post_by_id('${element.id}')">
                    </div>
                </div>
                <textarea rows="5" cols="50" readonly>${content_value}</textarea>
                <div class="message-card-second-div">
                    <p class="message-card-p1">From.</p>
                    <p class="message-card-p1">${from_value}</p>
                </div>
            </div>
                `);
            });
        });
}

function posting() {
    const passwordInput = document.getElementById('passwordInput');
    const password = passwordInput.value;
    let to_value = document.getElementById('dropdown1').value;
    let from_value = document.getElementById('dropdown2').value;
    let content_value = document.getElementById('messageTextArea').value;

    let formData = new FormData();
    formData.append('password', password);
    formData.append('to', to_value);
    formData.append('from', from_value);
    formData.append('content', content_value);

    if (dropdown1 === '' || dropdown2 === '') {
        alert('수신자와 발신자를 확인하세요.');
        return undefined;
    }
    if (messageTextArea === '') {
        alert('내용을 입력해주세요.');
        return undefined;
    }
    if (password === '') {
        alert('비밀번호를 입력해주세요.');
        return undefined;
    }
    fetch('/userinfo', { method: 'POST', body: formData })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            alert('전송 완료!');
            location.reload();
        })
        .catch((err) => {
            alert('오류가 발생하였습니다.\n\n다시 시도해주세요.)');
            messageTextArea = '';
        });
}

//people에서 more 클릭 하면 모달1 버튼나오게 하기 함수
const moreBtn0 = document.getElementById('more-btn0');
const moreBtn1 = document.getElementById('more-btn1');
const moreBtn2 = document.getElementById('more-btn2');
const moreBtn3 = document.getElementById('more-btn3');

// 모달1 GET 함수
function modal1Get0() {
    document.getElementById('loading').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 500);
    modal.classList.toggle('hide'); // 모달1 창 보이게하기
    backdrop.classList.toggle('hide'); // 어두운 배경화면 보이게 하기
    modal.style.position = 'relative'; // 모달1 창을 backdrop 위에 위치시키기
    modal.classList.add('lightbox-fade-in'); // fade in 효과 주기
    fetch('/intro')
        .then((res) => res.json())
        .then((data) => {
            console.log(data.intro[0]);
            const userIntro = data.intro[0];
            document.getElementById('modal1-img').src = userIntro.photo;
            document.getElementById('modal1-name').textContent = userIntro.name;
            document.getElementById('modal1-age').value = userIntro.age;
            document.getElementById('modal1-address').value = userIntro.address;
            document.getElementById('modal1-MBTI').value = userIntro.MBTI;
            document.getElementById('modal1-hobby').value = userIntro.hobby;
            document.getElementById('modal1-blog').value = userIntro.blog;
            document.getElementById('modal1-s&w').value = userIntro['s&w'];
            document.getElementById('modal1-resolve').value = userIntro.resolve;
        });
    document.getElementById('modal1-blog').addEventListener('click', () => {
        const url = document.getElementById('modal1-blog').value;
        if (url) {
            window.open(url, '_blank');
        }
    });
}

function modal1Get1() {
    document.getElementById('loading').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 500);
    modal.classList.toggle('hide'); // 모달1 창 보이게하기
    backdrop.classList.toggle('hide'); // 어두운 배경화면 보이게 하기
    modal.style.position = 'relative'; // 모달1 창을 backdrop 위에 위치시키기
    modal.classList.add('lightbox-fade-in'); // fade in 효과 주기
    fetch('/intro')
        .then((res) => res.json())
        .then((data) => {
            console.log(data.intro[1]);
            const userIntro = data.intro[1];
            document.getElementById('modal1-img').src = userIntro.photo;
            document.getElementById('modal1-name').textContent = userIntro.name;
            document.getElementById('modal1-age').value = userIntro.age;
            document.getElementById('modal1-address').value = userIntro.address;
            document.getElementById('modal1-MBTI').value = userIntro.MBTI;
            document.getElementById('modal1-hobby').value = userIntro.hobby;
            document.getElementById('modal1-blog').value = userIntro.blog;
            document.getElementById('modal1-s&w').value = userIntro['s&w'];
            document.getElementById('modal1-resolve').value = userIntro.resolve;
        });
    document.getElementById('modal1-blog').addEventListener('click', () => {
        const url = document.getElementById('modal1-blog').value;
        if (url) {
            window.open(url, '_blank');
        }
    });
}

function modal1Get2() {
    document.getElementById('loading').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 500);
    modal.classList.toggle('hide'); // 모달1 창 보이게하기
    backdrop.classList.toggle('hide'); // 어두운 배경화면 보이게 하기
    modal.style.position = 'relative'; // 모달1 창을 backdrop 위에 위치시키기
    modal.classList.add('lightbox-fade-in'); // fade in 효과 주기
    fetch('/intro')
        .then((res) => res.json())
        .then((data) => {
            console.log(data.intro[2]);
            const userIntro = data.intro[2];
            document.getElementById('modal1-img').src = userIntro.photo;
            document.getElementById('modal1-name').textContent = userIntro.name;
            document.getElementById('modal1-age').value = userIntro.age;
            document.getElementById('modal1-address').value = userIntro.address;
            document.getElementById('modal1-MBTI').value = userIntro.MBTI;
            document.getElementById('modal1-hobby').value = userIntro.hobby;
            document.getElementById('modal1-blog').value = userIntro.blog;
            document.getElementById('modal1-s&w').value = userIntro['s&w'];
            document.getElementById('modal1-resolve').value = userIntro.resolve;
        });
    document.getElementById('modal1-blog').addEventListener('click', () => {
        const url = document.getElementById('modal1-blog').value;
        if (url) {
            window.open(url, '_blank');
        }
    });
}

function modal1Get3() {
    document.getElementById('loading').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
    }, 500);
    modal.classList.toggle('hide'); // 모달1 창 보이게하기
    backdrop.classList.toggle('hide'); // 어두운 배경화면 보이게 하기
    modal.style.position = 'relative'; // 모달1 창을 backdrop 위에 위치시키기
    modal.classList.add('lightbox-fade-in'); // fade in 효과 주기
    fetch('/intro')
        .then((res) => res.json())
        .then((data) => {
            console.log(data.intro[3]);
            const userIntro = data.intro[3];
            document.getElementById('modal1-img').src = userIntro.photo;
            document.getElementById('modal1-name').textContent = userIntro.name;
            document.getElementById('modal1-age').value = userIntro.age;
            document.getElementById('modal1-address').value = userIntro.address;
            document.getElementById('modal1-MBTI').value = userIntro.MBTI;
            document.getElementById('modal1-hobby').value = userIntro.hobby;
            document.getElementById('modal1-blog').value = userIntro.blog;
            document.getElementById('modal1-s&w').value = userIntro['s&w'];
            document.getElementById('modal1-resolve').value = userIntro.resolve;
        });
    document.getElementById('modal1-blog').addEventListener('click', () => {
        const url = document.getElementById('modal1-blog').value;
        if (url) {
            window.open(url, '_blank');
        }
    });
}

moreBtn0.addEventListener('click', modal1Get0);
moreBtn1.addEventListener('click', modal1Get1);
moreBtn2.addEventListener('click', modal1Get2);
moreBtn3.addEventListener('click', modal1Get3);

function display_edit_form(id, password) {
    fetch('/userinfo')
        .then((res) => res.json())
        .then((data) => {
            let to_value = document.getElementById('dropdown1').value;
            let from_value = document.getElementById('dropdown2').value;
            let content_value =
                document.getElementById('messageTextArea').textContent;

            const modalContainer = document.createElement('div');
            modalContainer.className = 'modal-container1';
            modalContainer.innerHTML = `
            <div id="modal2-div1">
                <div class="modal2-div1-div">
                    <label for="editDropdown1">누구에게 보낼까요?</label>
                    <select id="editDropdown1">
                        <option value="" disabled selected hidden>
                        선택하세요
                        </option>
                        <option value="김환훈">김환훈</option>
                        <option value="이진솔">이진솔</option>
                        <option value="원유길">원유길</option>
                        <option value="이수진">이수진</option>
                    </select>
                </div>
                <div class="modal2-div1-div">
                    <label for="editDropdown2">나는 누구?</label>
                    <select id="editDropdown2">
                        <option value="" disabled selected hidden>
                        선택하세요
                        </option>
                        <option value="김환훈">김환훈</option>
                        <option value="이진솔">이진솔</option>
                        <option value="원유길">원유길</option>
                        <option value="이수진">이수진</option>
                    </select>
                </div>
            </div>
            <div id="modal2-div2">
                <h2>수정할 내용을 입력하세요.</h2>
                <textarea id="editMessageTextArea" placeholder="수정할 메세지를 입력하세요." rows="5" cols="50">${content_value}</textarea>
            </div>
            <div id="modal2-div3">
                <input id="modal2Send" type="button" value="수정하기">
                <input id="modal2Close" type="button" value="닫기">
            </div>
        `;

            modalContainer.querySelector('#modal2Close').onclick = function () {
                document.body.removeChild(modalContainer);
            };

            modalContainer.querySelector('#modal2Send').onclick = function () {
                const editDropdown1 =
                    document.getElementById('editDropdown1').value;
                const editDropdown2 =
                    document.getElementById('editDropdown2').value;
                const editMessageTextArea = document.getElementById(
                    'editMessageTextArea'
                ).value;

                let formData = new FormData();
                formData.append('id_give', id);
                formData.append('password', password);
                formData.append('edit_dropdown1_give', editDropdown1);
                formData.append('edit_dropdown2_give', editDropdown2);
                formData.append(
                    'edit_messageTextArea_give',
                    editMessageTextArea
                );

                fetch('/userinfo', { method: 'UPDATE', body: formData })
                    .then((res) => res.json())
                    .then((data) => {
                        alert(data['msg']);
                        window.location.reload();
                    });
                document.body.removeChild(modalContainer);
            };

            document.body.appendChild(modalContainer);
        });
}

//업데이트 함수 비밀번호를 입력받고 일치할 때만 수정 폼 디스플레이하게 변경
function edit_post_by_id(id) {
    if (confirm('수정하시겠습니까?')) {
        const password = prompt('비밀번호를 입력하세요:');
        if (password === null) {
            return; // 입력을 취소한 경우 함수 종료
        }

        // 비밀번호 확인 요청을 서버에 보내기
        fetch('/check_password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                password: password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.msg === '일치') {
                    // 비밀번호가 일치하는 경우 수정 폼 표시
                    display_edit_form(id, password);
                } else {
                    alert('비밀번호가 일치하지 않습니다.');
                }
            });
    }
}

//id값을 매개변수로 하고 비밀번호를 입력해야하는 삭제함수
function delete_post_by_id(id) {
    if (confirm('삭제하시겠습니까?')) {
        const password = prompt('비밀번호를 입력하세요:');
        if (password === null) {
            return; // 입력을 취소한 경우 함수 종료
        }

        const formData = new FormData();
        formData.append('id', id);
        formData.append('password', password);

        fetch('/userinfo', { method: 'DELETE', body: formData })
            .then((res) => res.json())
            .then((data) => {
                alert(data['msg']);
                window.location.reload();
            });
    }
}
// 스크롤 맨 아래일때 네비게이션 안보이게하기
window.onscroll = function (ev) {
    let NavCon = document.querySelector('#nav-con');
    if (
        window.innerHeight + Math.round(window.scrollY) >=
        document.body.offsetHeight
    ) {
        NavCon.classList.add('nav-con-none');
    } else {
        NavCon.classList.remove('nav-con-none');
    }
};
