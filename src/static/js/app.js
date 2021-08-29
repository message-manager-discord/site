document.addEventListener('DOMContentLoaded', function () {
    const checkbox = document.getElementById('toggle-dark')
    checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
        document.documentElement.classList.add("dark")
        localStorage.theme = 'dark'
        } else {
        document.documentElement.classList.remove("dark")
        localStorage.theme = 'light'
        }
    })
    if (document.documentElement.classList.contains("dark")) {
        checkbox.checked = true
    } else {
        checkbox.checked = false
    }
    const openMenu = document.getElementById("open-menu")
    const closeMenu = document.getElementById("close-menu")
    const menuItems = document.getElementById("menu-items")

    openMenu.addEventListener("click", (event) => {
        event.preventDefault()
        openMenu.classList.add("hidden")
        closeMenu.classList.remove("hidden")
        menuItems.classList.remove("hidden")
    })

    closeMenu.addEventListener("click", (event) => {
        event.preventDefault()
        openMenu.classList.remove("hidden")
        closeMenu.classList.add("hidden")
        menuItems.classList.add("hidden")
    })
})