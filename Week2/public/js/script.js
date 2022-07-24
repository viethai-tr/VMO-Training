var socket = io("/");
var myPeer = new Peer(undefined, {
    host: '/',
    port: '3031'
});