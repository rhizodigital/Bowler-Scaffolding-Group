import transitionCompleted from "../../utils/transitioned";

class DropdownWrapper extends HTMLElement {
  // Encapsulate all the logic and event handling for the header and mobile navigation

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  connectedCallback() {
    if (this) {
      this.addEventListener("click", this.handleClick);
    }
  }
  handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdownToggle = target.closest(
      "[data-dropdown-toggle]"
    ) as HTMLElement;

    if (dropdownToggle) {
      this.toggleDropdown(dropdownToggle);
    }
  }

  toggleDropdown(toggle: HTMLElement) {
    console.log("dropdown clicked", toggle);
    if (toggle.getAttribute("aria-expanded") === "false") {
      this.openDropdown(toggle);
    } else {
      this.closeDropdown(toggle);
    }
  }

  openDropdown(toggle: HTMLElement) {
    const dropdown = this.getDropdown(toggle);
    if (!dropdown) return;

    this.classOtherDropdowns(toggle);

    this.changeToggleState(true, toggle);
    dropdown.classList.remove("hidden");
    requestAnimationFrame(() => {
      dropdown.setAttribute("data-dropdown", "open");
    });
  }

  async closeDropdown(toggle: HTMLElement) {
    const dropdown = this.getDropdown(toggle);
    if (!dropdown) return;

    this.changeToggleState(false, toggle);
    dropdown.setAttribute("data-dropdown", "");

    await transitionCompleted(dropdown);
    dropdown.classList.add("hidden");
  }

  changeToggleState(state: boolean, toggle: HTMLElement) {
    toggle.setAttribute("aria-expanded", state.toString());
    const dropdownArrow = toggle.querySelector("[data-dropdown-arrow]");
    if (dropdownArrow) {
      dropdownArrow.setAttribute(
        "data-dropdown-arrow",
        state ? "open" : "closed"
      );
    }
  }

  classOtherDropdowns(toggle: HTMLElement) {
    const toggles = this.querySelectorAll("[data-dropdown-toggle]");
    toggles.forEach((node) => {
      if (node !== toggle && node.getAttribute("aria-expanded") === "true") {
        this.closeDropdown(node as HTMLElement);
      }
    });
  }

  private getDropdown(toggle: HTMLElement): HTMLElement | null {
    const dropdown = toggle.nextElementSibling as HTMLElement;
    return dropdown?.hasAttribute("data-dropdown") ? dropdown : null;
  }
}

if (typeof window !== "undefined") {
  customElements.define("dropdown-wrapper", DropdownWrapper);
}

declare global {
  interface HTMLElementTagNameMap {
    "dropdown-wrapper": DropdownWrapper;
  }
}
