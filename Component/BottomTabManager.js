class BottomTabManager extends HTMLElement {
	static observedAttributes = ["tabs_name", "tabs_icon", "hideTabName"]
	#shadow = null
	#btns
	#views
	#at = null
	#t = []
	constructor() {
		super()
		this.#btns = document.createElement("div")
		this.#views = document.createElement("div")

		// Style
		const style = this.style
		style.display = "block"
		style.width = "100vw"
		style.height = "100vh"
		style.padding = "0"
		style.margin = "0"
		style.position = "fixed"
		style.top = "0"
		style.left = "0"
		style.boxSizing = "border-box"
	}

	get tabs() {
		return this.#t
	}

	get current_tab() {
		return this.#t[this.#at]
	}

	get hideTabName() {
		const t = this.getAttribute("hideTabName") || null
		if (t == null || t == "false") return false
		return true
	}

	set hideTabName(v) {
		if (typeof v != "boolean")
			throw new TypeError("hideTabName should have a boolean value")

		if (v) this.setAttribute("hideTabName", "")
		else this.removeAttribute("hideTabName")
	}

	get current_tab_index() {
		return this.#at
	}
	set current_tab_index(v) {
		if (typeof v != "number")
			throw new TypeError("current_tab_index should be type of number!")
		if (v >= this.#t.length)
			throw new Error(
				"current_tab_index cannot be greater or equal to tabs.length"
			)
		this.#activateTab(v)
	}

	connectedCallback() {
		this.#shadow = this.attachShadow({ mode: "open" })
		this.#shadow.appendChild(this.#views)
		this.#shadow.appendChild(this.#btns)

		// Views Style
		const styles = new CSSStyleSheet()
		/*
		style = this.#view.style
		style.display = "block"
		style.width = "100vw"
		style.height = "calc(100vh - 50px)"
		style.padding = "0"
		style.margin = "0"
		style.overflowX = "hidden"
		style.overflowY = "auto"
		style.boxSizing = "border-box"

		// Buttons Style
		style = this.#btn.style
		style.display = "flex"
		style.flexFlow = "row"
		style.justifyContent = "center"
		*/

		// Tabs Attribute include
		if (!this.hasAttribute("tabs_name") && !this.hasAttribute("tabs_icon"))
			return

		let names = this.getAttribute("tabs_name") || null
		let icons = this.getAttribute("tabs_icon") || null

		if (names == null && icons == null) return
		if (
			names.replace(/ /g, "").replace(/,/g, "").length == 0 &&
			icons.replace(/ /g, "").replace(/,/g, "").length == 0
		)
			return

		const r = []
		if (names != null) {
			names = names.split(",")
			for (let i = 0, l = names.length; i < l; i++) {
				r[i] = { n: names[i], i: null }
			}
		}
		if (icons != null) {
			icons = icons.split(",")
			for (let i = 0, l = icons.length; i < l; i++) {
				if (r[i] != null) r[i].i = icons[i]
				else r[i] = { n: null, i: icons[i] }
			}
		}

		for (let i = 0, l = r.length; i < l; i++) {
			this.addTab(r[i].n, r[i].i)
		}
	}

	disconnectedCallback() {}

	addTab(name, icon) {
		if (typeof name != "string" || name.replace(/ /g, "").length == 0)
			name = null
		if (typeof icon != "string" || icon.replace(/ /g, "").length == 0)
			icon = null
		if (name == null && icon == null) return

		const tab = {
			name: name,
			icon: icon,
			btn: document.createElement("button"),
			view: document.createElement("div")
		}
		tab.btn.type = "button"

		if (tab.icon != null) {
			if (tab.icon.replace(/ /g, "").toLowerCase().indexOf("<svg") == 0) {
				tab.btn.innerHTML = tab.icon
			} else {
				const icon_url = tab.icon
				tab.icon = document.createElement("img")
				tab.icon.src = icon_url
				tab.btn.appendChild(tab.icon)
			}
		}
		if (tab.name != null) {
			const txt = document.createElement("p")
			txt.innerText = tab.name
			tab.btn.appendChild(txt)
		}

		this.#views.appendChild(tab.view)
		this.#btns.appendChild(tab.btn)
		this.#t.push(tab)
	}

	#activateTab(i) {}

	attributeChangedCallback(n, ov, nv) {
		switch (n) {
			case "hideTabName":
				if (nv != "false" && this.hasAttribute("hideTabName")) {
					this.#btns.setAttribute("noName", "")
				} else {
					this.#btns.removeAttribute("noName")
				}
				break

			default:
			// code
		}
		console.log(n, ov, nv)
	}
}
customElements.define("bottom-tab-manager", BottomTabManager)
