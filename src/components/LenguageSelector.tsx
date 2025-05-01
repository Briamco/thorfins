import { useEffect, useState } from "react"
import { FlagIcon, FlagIconCode } from "react-flag-kit"
import { useTranslation } from "react-i18next"
import { Menu } from "@headlessui/react"

interface Lang {
  id: number
  lang: string
  lenguage: string
  flagCode: FlagIconCode
}

const languages: Lang[] = [
  { id: 1, lang: "en", lenguage: "English", flagCode: "US" },
  { id: 2, lang: "es", lenguage: "Español", flagCode: "ES" },
]

const LenguageSelector = () => {
  const { i18n } = useTranslation()
  const [lenguage, setLenguage] = useState<string>(localStorage.getItem("financeLang") || "en")

  const handleLanguageChange = (newLang: string) => {
    setLenguage(newLang)
    i18n.changeLanguage(newLang)
  }

  useEffect(() => {
    handleLanguageChange(lenguage)
  }, [lenguage])

  useEffect(() => {
    const onLangChange = () => {
      const updatedLang = localStorage.getItem("financeLang") || "en"
      setLenguage(updatedLang)
    }

    window.addEventListener("financeLangChanged", onLangChange)

    return () => {
      window.removeEventListener("financeLangChanged", onLangChange)
    }
  }, [])

  const selectedLang = languages.find(l => l.lang === lenguage)

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600">
        <FlagIcon code={selectedLang?.flagCode || "US"} size={20} />
        {selectedLang?.lenguage}
      </Menu.Button>
      <Menu.Items className="absolute z-10 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        {languages.map((lang) => (
          <Menu.Item key={lang.id}>
            {({ active }) => (
              <button
                onClick={() => {
                  localStorage.setItem("financeLang", lang.lang)
                  window.dispatchEvent(new Event("financeLangChanged"))
                }}
                className={`${active ? "bg-gray-100 dark:bg-gray-700" : ""
                  } flex items-center w-full px-4 py-2 text-sm text-left text-gray-900 dark:text-white gap-2`}
              >
                <FlagIcon code={lang.flagCode} size={20} />
                {lang.lenguage}
              </button>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  )
}

export default LenguageSelector
