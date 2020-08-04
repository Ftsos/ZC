const socket = io()

const videos = document.querySelector('#videos')

const myPeer = new Peer(undefined, {
  host: '/peer',
  port: '8081'
})


const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}


navigator.mediaDevices.getUserMedia({
	audio: true,
	video: true
}).then(stream => {
	addVideoStream(myVideo, stream)

	myPeer.on('call', call => {
    call.answer(stream)
    const videox = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(videox, userVideoStream)
    })
  })
 	socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  if (peers.userId) peers.userId.close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videos.append(video)
}


function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers.userId = call
}