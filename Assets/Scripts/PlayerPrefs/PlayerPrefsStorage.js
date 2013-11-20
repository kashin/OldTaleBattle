//  This class is made to handle everything that might be needed for saving/loading player prefs.
public class PrefsStorage
{
  static public var unknownStringKey = "unknown-key";

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
    return PlayerPrefs.GetInt(key, defaultValue);
  }
}