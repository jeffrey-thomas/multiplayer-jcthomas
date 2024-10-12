import { Vector } from "./Vector"

/** Represents a rectangular geometry */
export class Rectangle{
    private _x:number
    private _y:number
    private _w:number
    private _h:number

    /**
     * Constructor
     * @param x the x-coordinate of the left edge
     * @param y the y-coordinate of the top edge
     * @param width the width of the rectangle
     * @param height the height of the rectangle
     */
    constructor(x:number, y:number, width:number, height:number){
        this._x = x
        this._y = y
        this._w = width
        this._h = height
    }

    /** x-coordinate of the left edge */
    get x(){ return this._x }
    /** y-coordinate of the top edge */
    get y(){ return this._y }
    /** width of the rectangle */
    get width(){ return this._w }
    /** height of the rectangle */
    get height(){ return this._h }

    /** x-coordinate of the left edge */
    get left(){ return this._x }
    /** x-coordinate of the right edge */
    get right(){ return this.x+this._w }
    /** y-coordinate of the top edge */
    get top(){ return this._y }
    /** y-coordinate of the bottom edge */
    get bottom(){ return this._y+this._h }

    /** x-coordinate of the center of the rectangle */
    get centerX(){ return this._w/2 + this._x }
    /** y-coordinate of the center of the rectangle */
    get centerY(){ return this._h/2 + this._y }
    /** vector representation of the center of the rectangle */
    get center():Vector{ return [this.centerX, this.centerY] }

    /** Determine whether this rectangle intersects another
     *  @param other the other rectangle
     *  @returns whether the 2 rectangles intersect
     */
    intersects(other:Rectangle){
        return this.left < other.right && other.left < this.right && this.top < other.bottom && other.top < this.bottom
    }

    /**
     * Return a string representation of this rectangle
     * @returns a string with the x, y, width, and height of the rectangle
     */
    toString(){
        return `[${this._x}, ${this._y}, ${this._w}, ${this._h}]`
    }
}