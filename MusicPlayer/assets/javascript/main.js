/**
 * Steps:
 * 1. Render songs
 * 2. Scroll top
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next /Previous
 * 6. Random
 * 7. Next / Repeat when ending
 * 8. Active song
 * 9. Scroll Active song into view
 * 10. Play song when click
 *
 * Các bài hát sử dụng trong video:
 * 1. Vicetone - Nevada
 * 2. K-391 - Summertime [Sunshine]
 * 3. TheFatRat The calling (feat. Laura Brehm)
 * 4. Lost Frequencies feat. Janieck Devy - Reality
 * 5. Đen - Ngày Khác Lạ ft. Giang Pham, Triple D
 * 6. Lemon Tree - DJ DESA REMIX
 * 7. Maroon 5 - Sugar
 * 8. Westlife - My Love
 * 9. Charlie Puth - Attention
 * 10. Monsters - Katie Sky
 * 11. Thêm config settings trên local storage
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playList = $('.playlist');
const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
let songList = ''; // để let vì cần thay đổi trong hàm render và để khai báo ở ngoài để truy cập global

const PLAYER_STORAGE_KEY = 'QUYN_Player';

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRadom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Nevada',
            singer: 'Vicetone',
            path: './assets/music/Nevada.mp3',
            image: './assets/img/Nevada.jpg',
        },
        {
            name: 'SummerTime',
            singer: 'K-391',
            path: './assets/music/SummerTime.mp3',
            image: './assets/img/SummerTime.jpg',
        },
        {
            name: 'Monody',
            singer: 'TheFatRat',
            path: './assets/music/Monody.mp3',
            image: './assets/img/Monody.jpg',
        },
        {
            name: 'TheCalling',
            singer: 'TheFatRat',
            path: './assets/music/TheCalling.mp3',
            image: './assets/img/TheCalling.jpg',
        },
        {
            name: 'LemonTree',
            singer: 'FoolsGarden',
            path: './assets/music/LemonTree.mp3',
            image: './assets/img/LemonTree.jpg',
        },
        {
            name: 'Reality',
            singer: 'LostFrequencies',
            path: './assets/music/Reality.mp3',
            image: './assets/img/Reality.jpg',
        },
        {
            name: 'Sugar',
            singer: 'Maroon5',
            path: './assets/music/Sugar.mp3',
            image: './assets/img/Sugar.jpg',
        },
        {
            name: 'Unity',
            singer: 'TheFatRat',
            path: './assets/music/Unity.mp3',
            image: './assets/img/Unity.jpg',
        },
        {
            name: 'Faded',
            singer: 'AlanWalker',
            path: './assets/music/Faded.mp3',
            image: './assets/img/Faded.jpg',
        },
        {
            name: 'Holo',
            singer: 'Ampyx',
            path: './assets/music/Holo.mp3',
            image: './assets/img/Holo.jpg',
        },
    ],

    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    render: function () {
        const htmls = this.songs.map(
            (song, index) =>
                `<div class="song ${
                    index === this.currentIndex ? 'active' : ''
                }" data-index="${index}">
                    <div
                        class="thumb"
                        style="
                            background: url('${song.image}') no-repeat center / cover;
                        "
                    ></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>`
        );
        playList.innerHTML = htmls.join('');

        songList = $$('.song'); // thực chất sau dòng innerHTML trên dữ liệu mới thay đổi, lúc này $$ mới đúng chứ k phải 3 song mẫu để code giao diện
    },

    handleEvents: function () {
        // Xử lý scrollTop: thu / phóng CD
        cd.style.transition = 'all 0.3s'; // Thêm vào cho đẹp thôi
        const cdWidth = cd.offsetWidth;

        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? `${newCdWidth}px` : 0; // 0 thì k cần px
            cd.style.opacity = newCdWidth / cdWidth; // trong js không cần calc luôn, dùng vẫn đc nhưng dài `calc(${newCdWidth} / ${cdWidth})`
        };

        // Xử lý quay CD:
        const cdThumbAnimate = cdThumb.animate([{ transform: 'rotate(360deg)' }], {
            duration: 10000, // 10s
            iterations: Infinity,
        });
        cdThumbAnimate.pause();

        // Xử lý click play button
        const _this = this;
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause(); // đây là phương thức dừng audio
            } else {
                audio.play(); // đây là phương thức chạy audio
            }
        };

        // -> Chú ý ta có thể cho onplay() và onpause() gộp vào đoạn if else trên và player thành toggle tuy nhiên về logic thì phải chạy mới sửa biến isPlaying và add class vì có thể ấn mà nó k chạy/nhận/hoạt động
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing'); // css sẵn thêm playing thì icon từ pause thành playing rồi nhé
            cdThumbAnimate.play();
        };
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        };

        // Khi tiến độ bài hát thay đổi(luôn bắt event khi audio phát / tua): thanh input chạy theo time trôi audio
        audio.ontimeupdate = function () {
            if (audio.duration) {
                // Có lúc duration = 0 do bài hát chưa tải xong hay sao ấy, chia ra NaN nên thêm đk vào
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
                progress.value = progressPercent;
                progress.style.backgroundSize = `${progressPercent}% 100%`; // Chú ý thêm phần này để phân biệt phần đã và chưa chạy
            }
        };

        // Xử lý tua audio
        // -> onchange hay oninput đều được nhé, nhưng oninput hình như tốt hơn, k bị tua mà nó cứ quay về chỗ cũ
        // -> trên mạng ngta cũng dùng input chứ k dùng change (do change phải blur ra ngoài mới nhận ấy nên lỗi đúng rồi)
        progress.oninput = function () {
            // console.log(this.value); // this hay e.target đều là 1 và là progress nhé
            const seekTime = (audio.duration * this.value) / 100;
            audio.currentTime = seekTime;
        };

        // Xử lý nextSong/prevSong:
        nextBtn.onclick = () => {
            if (_this.isRadom) {
                _this.playRandomSong();
            } else {
                _this.nextSong(); // Chú ý dùng _this nhé this sai khó phát hiện đó (bị rồi)
            }
            audio.play(); // Audio đang phát mà next sẽ lỗi k phát nữa vì path đã bị đổi, lúc này thêm dòng audio.play() sau khi gọi hàm (hoặc nhét vào cuối hàm) là được
            cdThumbAnimate.cancel();
            cdThumbAnimate.play(); // mẹo reset lại animate là hủy rồi play lại (khi next cdThmb vẫn quay tiếp cái vòng đang quay của bài cũ)
            // Tuy nhiên cdThumbAnimate.play() đã được gọi lại khi audio.play() lại rồi (onplay()) nên có thể bỏ dòng này
            _this.scrollToActiveSong();
        };

        prevBtn.onclick = () => {
            if (_this.isRadom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            cdThumbAnimate.cancel();
            cdThumbAnimate.play();
            _this.scrollToActiveSong();
        };

        // Xử lý randomSong mode
        randomBtn.onclick = () => {
            _this.isRadom = !_this.isRadom;
            _this.setConfig('isRadom', _this.isRadom);
            randomBtn.classList.toggle('active', _this.isRadom); // đối số 2 là true thì add, false thì remove; css sẵn thêm active là tô màu rồi
        };

        // Xử lý repeatSong
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        };

        // Xử lý khi hết audio: next or repeat (sau khi phát hết audio thì sẽ đứng ở vị trí cuối bài hát không làm gì, phải xử lý next or repeat)
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play(); // .load() và .play() đều được nhưng nên dùng .play() hơn vì dữ liệu bài đã load sẵn rồi, play() lại là được còn load phải tại lại thông tin
            } else {
                nextBtn.click(); // onclick hay addEventListener('clicl', ...) là lắng nghe, còn .click() là code bấm luôn
            }
        };

        // Xử lý click vào playList: click để chuyển bài sao cho chỉ khi click vào VÙNG KHÁC OPTION của SONG KHÔNG ACTIVE mới chuyển
        // (option của song nào cũng đều k next mà sẽ thực hiện chức năng của option, còn khi khác option thì chỉ có song not active mới chuyển)
        // Nếu chưa hiểu rõ có thể xem file note hoặc ảnh để rõ hơn. (chưa xử lý option nên gộp đk thôi)
        playList.onclick = function (e) {
            if (!e.target.closest('.option') && e.target.closest('.song:not(.active)')) {
                // Thực hiện next bài đó: Nhớ thêm attribute "data-index" vào chỗ render ấy để lấy index song
                const songNode = e.target.closest('.song:not(.active)'); // song mà mình click vào nó / con của nó trừ option
                // console.log(songNode.getAttribute('data-index'));   // đều ra index của song mình click vào
                // console.log(songNode.dataset.index);                // đều ra index của song mình click vào
                _this.updateCurIndex = Number(songNode.dataset.index); // dataset.index là chuỗi, do mình truyền vô setter nên k có cũng k lỗi, nhưng chú ý
                _this.loadCurrentSong();
                audio.play(); // nhớ audio luôn đi kèm với loadCurrentSong() (phát nhạc sau khi load thông tin mới)
            }
        };
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
        Object.defineProperty(this, 'updateCurIndex', {
            // thật ra thấy tạo hàm ok hơn, nhưng prop cũng đc
            set: function (newIndex) {
                songList[this.currentIndex].classList.remove('active');
                this.currentIndex = newIndex;
                songList[this.currentIndex].classList.add('active');
            },
        });
    },

    /**
     * Tải thông tin bài hát: Hiển thị tên bài, ảnh, path audio thôi chứ chưa phát audio luôn nhá
     */
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.background = `url(${this.currentSong.image}) no-repeat center / cover`;
        audio.src = this.currentSong.path;
    },

    loadConfig: function () {
        this.isRadom = this.config.isRadom;
        this.isRepeat = this.config.isRepeat;

        // Object.assign(this, this.config); // hợp nhất các key vào this, tuy nhiên sau này có thể có key k mong muốn hợp vào
    },

    nextSong: function () {
        this.updateCurIndex = (this.currentIndex + 1) % this.songs.length;
        this.loadCurrentSong();
    },

    prevSong: function () {
        this.updateCurIndex = (this.currentIndex - 1 + this.songs.length) % this.songs.length;
        this.loadCurrentSong();
    },

    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
            console.log(newIndex, this.currentIndex);
        } while (newIndex === this.currentIndex);
        this.updateCurIndex = newIndex;
        this.loadCurrentSong();
    },

    scrollToActiveSong: function () {
        setTimeout(() => {
            songList[this.currentIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }, 300);
    },

    start: function () {
        // load cấu hình đã lưu vào ứng dụng
        this.loadConfig();

        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe / xử lý sự kiện
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // Render playlist
        this.render();

        // Hiển thị trạng thái ban đầu của random, repeat (xử lý cho gọn sau)
        randomBtn.classList.toggle('active', this.isRadom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    },
};

app.start();
