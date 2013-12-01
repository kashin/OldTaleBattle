// This class is made to handle everything that might be needed for saving/loading player prefs.
public class PrefsStorage
{
  static public var unknownStringKey = "unknown-key";

  static private var highScoreBaseNickKey = "HighScoreNick";
  static private var highScoreBaseKey = "HighScore";

  static function storeStringKey(key: String, value: String)
  {
    PlayerPrefs.SetString(key, value);
  }
  static function getStringKey(key: String): String
  {
    return PlayerPrefs.GetString(key, unknownStringKey);
  }

  static function storeIntKey(key: String, value: int)
  {
    PlayerPrefs.SetInt(key, value);
  }
  static function getIntKey(key: String, defaultValue: int): int
  {
    if (!PlayerPrefs.HasKey(key))
    {
      storeIntKey(key, defaultValue);
    }
    return PlayerPrefs.GetInt(key, defaultValue);
  }

/*------------------------------------------ HIGH SCORE METHODS ------------------------------------------*/
// Each High score is stored as a String key for a nick name and as an int value for score itself.

  // Get/Set Nickname for a highscore
  static function setHighScoreNick(scoreNumber: int, userName: String)
  {
    var key = highScoreBaseNickKey + scoreNumber.ToString();
    PlayerPrefs.SetString(key, userName);
  }
  static function getHighScoreNick(scoreNumber: int): String
  {
    var key = highScoreBaseNickKey + scoreNumber.ToString();
    return PlayerPrefs.GetString(key, "");
  }
  // saves passed nick and returns replaced nick name.
  static function replaceHighScoreNick(scoreNumber: int, userName: String): String
  {
    var previousNickname = PrefsStorage.getHighScoreNick(scoreNumber);
    PrefsStorage.setHighScoreNick(scoreNumber, userName);
    return previousNickname;
  }

  // Get/Set Score for a highscore
  static function setHighScore(scoreNumber: int, score: int)
  {
    var key = highScoreBaseKey + scoreNumber.ToString();
    PlayerPrefs.SetInt(key, score);
  }
  static function getHighScore(scoreNumber: int): int
  {
    var key = highScoreBaseKey + scoreNumber.ToString();
    return PlayerPrefs.GetInt(key, 0);
  }
  // saves passed nick and returns replaced nick name.
  static function replaceHighScore(scoreNumber: int, score: int): int
  {
    var previousScore = PrefsStorage.getHighScore(scoreNumber);
    PrefsStorage.setHighScore(scoreNumber, score);
    return previousScore;
  }

  static function saveNewScore(scoreNumber: int, userName: String, score: int, maxScoreNumber: int)
  {
    if (scoreNumber < 0 || scoreNumber >= maxScoreNumber)
    {
      Debug.LogWarning("trying to save a score for an invalid position");
      return;
    }

    var previousNickName = PrefsStorage.replaceHighScoreNick(scoreNumber, userName);
    var previousHighScore = PrefsStorage.replaceHighScore(scoreNumber, score);
    for (var i = scoreNumber + 1; i < maxScoreNumber; i++)
    {
      previousNickName = PrefsStorage.replaceHighScoreNick(i, previousNickName);
      previousHighScore = PrefsStorage.replaceHighScore(i, previousHighScore);
    }
  }
}
