const videoGrid = document.getElementById('video-grid');

const myVideo = document.createElement('video');
myVideo.muted = true;
const peers = {};

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream);

    myPeer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        });
    });

    socket.on('user-connected', userId => {9
        connectNewUser(userId, stream);
    });
});

// const stream = await navigator.mediaDevices.getUserMedia({
//     video: true,
//     audio: true
// });

// addVideoStream(myVideo, stream);
// myPeer.on('call', call => {
//     call.answer(stream);
//     const video = document.createElement('video');
//     call.on('stream', userVideoStream => {
//         addVideoStream(video, userVideoStream);
//     });
// });

// myPeer.on('open', id => {
//     socket.emit('join-room', ROOM_ID, id, user);
// })

// socket.on('user-connected', userId => {
//     console.log('User connected: ' + userId);
// });

// socket.on('user-disconnected', userId => {
//     console.log(`User ${userId} disconnected!`);
//     if (peers[userId]) peers[userId].close();
// })

function connectNewUser(userId, stream) {
    const call = myPeer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });
    call.on('close', () => {
        video.remove();
    });

    peers[userId] = call;
}

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video);
}