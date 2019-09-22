export class Utilities {
  public static isTouchDevice(): boolean {
    const result = 'ontouchstart' in window        // works on most browsers
      || navigator.maxTouchPoints;       // works on IE10/11 and Surface

    if (result === true)
    {
      return true;
    }

    return result > 0;
  }
}
