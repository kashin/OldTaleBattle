#pragma strict

/// This class is used to draw a screen that shows a list of spells to choose as player's primary spell.
public class InGameSpellsScreen
{
  /*------------------------------------------ PUBLIC ------------------------------------------*/
  /*------------------------------------------ GAME OBJECTS ------------------------------------------*/
  public var mSpells: GameObject[];
  public var mPlayerStats: PlayerStats;

  /*------------------------------------------ TEXT ------------------------------------------*/
  public var mDescriptionLabelText = "Description:";
  public var mBackButtonText = "Back";
  
  /*------------------------------------------ STYLES ------------------------------------------*/
  public var mBackgroundStyle: GUIStyle;
  public var mButtonStyle: GUIStyle;
  public var mMainTextStyle: GUIStyle;
  public var mDescriptionStyle: GUIStyle;

  /*------------------------------------------ SIZES ------------------------------------------*/
  /// sizes are in percentage compare to a screen's sizes.
  public var mSpellsScrollViewAreaSize: Vector2 =  Vector2(0.3, 0.9);
  public var mSpaceBetweenElements = 15;
  public var mSpellButtonSize: Vector2 = Vector2(0.2, 0.1);
  public var mBackButtonSize: Vector2 = Vector2(0.1, 0.1);

  /*------------------------------------------ PRIVATE ------------------------------------------*/
  private var mSpellsAreaSize: Vector2 = Vector2(0, 0);
  private var mDescriptionAreaSize: Vector2 = Vector2(0, 0);
  private var mScrollPosition: Vector2 = Vector2(0.0f, 0.0f);
  private var mButtonSize: Vector2 = Vector2(0, 0);
  private var mBackButtonRealSize: Vector2 = Vector2(0, 0);
  private var mPreSelectedSpell: GameObject;
  private var mPreSelectedSpellBehavior: BasicMagicAttackBehavior;


  /*------------------------------------------ DRAW METHODS ------------------------------------------*/
  /** 
   * draws spells screen.
   * @returns true if 'back button' is pressed and false otherwise
   */
  public function drawScreen(): boolean
  {
    var result = false;
    // Draw Scroll Area
    GUI.BeginGroup(Rect(0, 0, mSpellsAreaSize.x, mSpellsAreaSize.y));
      mScrollPosition = GUI.BeginScrollView(Rect(0, 0, mSpellsAreaSize.x, mSpellsAreaSize.y - mBackButtonRealSize.y - mSpaceBetweenElements),
                                            mScrollPosition, Rect(0, 0, mButtonSize.x + mSpaceBetweenElements * 2, mButtonSize.y * mSpells.Length + mSpaceBetweenElements * (mSpells.Length + 1) ));

      var buttonPosition = Vector2(mSpaceBetweenElements, mSpaceBetweenElements);
      for (var i = 0; i < mSpells.Length; i++)
      {
        var spellBehavior = mSpells[i].GetComponent(BasicMagicAttackBehavior);
        var spellName = spellBehavior ? spellBehavior.Name : "" ;
        if ( GUI.Button(Rect(buttonPosition.x, buttonPosition.y, mButtonSize.x, mButtonSize.y), spellName, mButtonStyle) )
        {
          if (mPreSelectedSpellBehavior && mPreSelectedSpellBehavior.Name != spellName)
          {
            mPreSelectedSpell = mSpells[i];
            mPreSelectedSpellBehavior = spellBehavior;
          }
          else
          {
            mPreSelectedSpell = mSpells[i];
            mPreSelectedSpellBehavior = spellBehavior;
            if (mPlayerStats)
            {
              mPlayerStats.MagicAttack = mPreSelectedSpell;
            }
            result = true;
          }
        }
        buttonPosition.y += mButtonSize.y + mSpaceBetweenElements;
      }
      GUI.EndScrollView();
      if ( GUI.Button(Rect(mSpaceBetweenElements, mSpellsAreaSize.y - mBackButtonRealSize.y, mBackButtonRealSize.x, mBackButtonRealSize.y), mBackButtonText, mButtonStyle) )
      {
        result = true;
      }
    GUI.EndGroup(); // ScrollView Spells group.

    // Description section
    var descriptionWidth = Screen.width - mSpellsAreaSize.x - mSpaceBetweenElements * 2;
    var descriptionLabelHeight = 30;
    GUI.BeginGroup(Rect(mSpellsAreaSize.x + mSpaceBetweenElements, 0, descriptionWidth, mSpellsAreaSize.y));
      GUI.Label(Rect(0, mSpaceBetweenElements, descriptionWidth, descriptionLabelHeight), mDescriptionLabelText, mMainTextStyle);
      var descriptionBoxPosY = mSpaceBetweenElements * 2 + descriptionLabelHeight;
      var description = "";

      if (mPreSelectedSpellBehavior)
      {
        description = mPreSelectedSpellBehavior.Description;
      }
      GUI.Box(Rect(0, mSpaceBetweenElements * 2 + descriptionLabelHeight, descriptionWidth, mSpellsAreaSize.y - descriptionBoxPosY), description, mDescriptionStyle);
    GUI.EndGroup();
    
    return result;
  }

  /*------------------------------------------ CUSTOM METHODS ------------------------------------------*/
  public function initializeSizesAndPositions()
  {
    mSpellsAreaSize.x = Screen.width * mSpellsScrollViewAreaSize.x;
    mSpellsAreaSize.y = Screen.height * mSpellsScrollViewAreaSize.y;

    mDescriptionAreaSize.x = Screen.width - mSpellsAreaSize.x - mSpaceBetweenElements;
    mDescriptionAreaSize.x = mSpellsAreaSize.y;

    mButtonSize.x = Screen.width * mSpellButtonSize.x;
    mButtonSize.y = Screen.height * mSpellButtonSize.y;

    if (mSpells.Length > 0)
    {
      mPreSelectedSpell = mSpells[0];
      mPreSelectedSpellBehavior = mPreSelectedSpell.GetComponent(BasicMagicAttackBehavior);
    }

    mBackButtonRealSize.x = Screen.width * mBackButtonSize.x;
    mBackButtonRealSize.y = Screen.height * mBackButtonSize.y;
  }
}