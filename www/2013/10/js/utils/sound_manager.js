/**
 * Created by nico on 05/12/13.
 */

var SoundManager = function()
{

}
SoundManager.playing = false;
SoundManager.enabled = true;
SoundManager.CLAP = new Howl( {   urls: ['./audio/clap.mp3', './audio/clap.ogg' ], volume:.75      });
SoundManager.POUET = new Howl( {   urls: ['./audio/pouet.mp3', './audio/pouet.ogg' ], volume:.25      });

SoundManager.MUSIC = new Howl( {
	urls: ['./audio/musicbox.mp3', './audio/musicbox.ogg' ],
	autoplay: true,
	loop: true,
	volume: 0.25
//	onload: function() {
////		SoundManager.MUSIC.volume = 0;
//	}
});

SoundManager.play = function()
{
	return;
	if( !SoundManager.enabled )return;
	if( SoundManager.playing ) return;
	SoundManager.playing = true;
	SoundManager.MUSIC.fade( 0,.25, 1000, null );

}
SoundManager.stop = function()
{
//	return;
	if( !SoundManager.enabled )return;
	SoundManager.playing = false;
	SoundManager.MUSIC.fade( .25,0, 5000, null );
	SoundManager.enabled =false;
}