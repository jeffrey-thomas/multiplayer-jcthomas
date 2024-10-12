import { MenuItem } from "./MenuItem"

/** Represents a menu laid over the canvas */
export class Menu{

    /** The header of the menu */
    private _title:string
    /** List of options in the menu */
    private _items:MenuItem[]

    /** HTML DOM element */
    private _dom:HTMLDivElement

    /**
     * Constructor
     * @param title the header for the menu
     * @param items list of items in the menu
     */
    constructor(title:string, items:MenuItem[] = []){
        this._title = title
        this._items = [...items]

        //Create DOM elements
        this._dom = document.createElement('div')
        this._dom.id = this._title.replace(' ','-')
        const heading = document.createElement('h1')
        heading.innerText = title
        this._dom.appendChild(heading)
        this._items.forEach((item:MenuItem)=>{
            this.createButton(item)
        })

        document.getElementById('overlay')?.appendChild(this._dom)
    }

    //Getters
    get title(){ return this._title }
    get items(){ return this._items }
    get DomNode(){ return this._dom }

    /** Remove this menu from the screen */
    hide(){
        this._dom.classList.add('hidden')
    }

    /** Show this menu on the screen */
    show(){
        this._dom.classList.remove('hidden')
    }

    /** Add an option to this menu */
    addItem(item:MenuItem){
        this._items.push(item)
        this.createButton(item)
    }

    /** Remove an option from this menu */
    removeItem(item:MenuItem){
        this._items = this._items.filter((menuItem)=>{
            return !MenuItem.equal(item,menuItem)
        })

        this.removeButton(item)
    }

    /**
     * Create a button element for a menu option
     * @param item the menu option to make a button for
     */
    private createButton(item:MenuItem){
        const button = document.createElement('button')
        button.id = `${this._title.replace(' ','-')}:${item.label.replace(' ','-')}`
        button.onclick = item.action
        button.innerText = item.label

        this._dom.appendChild(button)
    }

    /**
     * Remove the button element for a menu option
     * @param item the menu option to remove the button for
     */
    private removeButton(item:MenuItem){
        const button = document.getElementById(`${this._title.replace(' ','-')}:${item.label.replace(' ','-')}`)
        if(button)
            this._dom.removeChild(button)
    }
}