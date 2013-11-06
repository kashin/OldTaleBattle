#pragma strict

public var mcLooped: boolean = false;
public var mcAudioSource: AudioSource;
public var mcAudioClip: AudioClip;


function Start()
{
  if (mcAudioSource == null)
  {
    mcAudioSource = audio;
  }
  if (mcAudioSource)
  {
    mcAudioSource.clip = mcAudioClip;
    mcAudioSource.loop = mcLooped;
    mcAudioSource.Play();
  }
  else
  {
    Debug.LogError("audio source is not attached to this object!");
  }
}

@script RequireComponent (AudioSource)
@script AddComponentMenu ("GameSounds/In Game Music")
