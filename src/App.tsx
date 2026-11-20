import { useEffect, useMemo, useState } from "react";
import { DESIGN_PROJECTS, PHOTO_ITEMS, type View } from "./data/portfolio";
import {
  buildFeaturedHighlights,
  getAdjacentItemId,
  type ContactFormValues,
} from "./utils/portfolioLogic";
import { Header } from "./components/Header";
import { HomeView } from "./components/HomeView";
import { DesignGallery } from "./components/DesignGallery";
import { PhotoGallery } from "./components/PhotoGallery";
import { AboutView } from "./components/AboutView";
import { Footer } from "./components/Footer";
import { ContactModal } from "./components/ContactModal";
import { HighlightModal } from "./components/HighlightModal";

export default function App() {
  const [view, setView] = useState<View>("home");
  const [contactOpen, setContactOpen] = useState(false);
  const [contactTopic, setContactTopic] =
    useState<ContactFormValues["topic"]>("Product Design");
  const [contactNote, setContactNote] = useState("");
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);

  const highlights = useMemo(
    () => buildFeaturedHighlights(DESIGN_PROJECTS, PHOTO_ITEMS),
    [],
  );

  const activeHighlight =
    highlights.find((item) => item.id === activeHighlightId) ?? null;

  const isAnyModalOpen =
    contactOpen || activeHighlight !== null || galleryModalOpen;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setGalleryModalOpen(false);
    setActiveHighlightId(null);
  }, [view]);

  const openContact = (
    topic: ContactFormValues["topic"] = "Product Design",
    note = "",
  ) => {
    setContactTopic(topic);
    setContactNote(note);
    setContactOpen(true);
  };

  return (
    <>
      <div
        data-blurred={isAnyModalOpen ? "true" : "false"}
        aria-hidden={isAnyModalOpen}
        className={`min-h-screen flex flex-col transition-[filter] duration-200 ${
          isAnyModalOpen ? "blur-[6px] pointer-events-none select-none" : ""
        }`}
      >
        <Header
          activeView={view}
          onNavigate={setView}
          onOpenContact={() =>
            openContact(view === "photo" ? "Street Photography" : "Product Design")
          }
        />

        <div className="flex-1">
          {view === "home" && (
            <HomeView
              onNavigate={setView}
              onOpenContact={() => openContact("Product Design")}
              onSelectHighlight={(id) => setActiveHighlightId(id)}
            />
          )}
          {view === "design" && (
            <DesignGallery
              onNavigate={setView}
              onModalChange={setGalleryModalOpen}
              onInquire={(topic, note) => openContact(topic, note)}
            />
          )}
          {view === "photo" && (
            <PhotoGallery
              onNavigate={setView}
              onModalChange={setGalleryModalOpen}
              onInquire={(topic, note) => openContact(topic, note)}
            />
          )}
          {view === "about" && (
            <AboutView
              onNavigate={setView}
              onOpenContact={() => openContact("Both")}
            />
          )}
        </div>

        <Footer
          onOpenContact={() =>
            openContact(view === "photo" ? "Street Photography" : "Product Design")
          }
        />
      </div>

      <HighlightModal
        highlight={activeHighlight}
        onClose={() => setActiveHighlightId(null)}
        onPrev={() =>
          setActiveHighlightId((id) =>
            id ? getAdjacentItemId(highlights, id, "prev") : null,
          )
        }
        onNext={() =>
          setActiveHighlightId((id) =>
            id ? getAdjacentItemId(highlights, id, "next") : null,
          )
        }
        onNavigate={setView}
        onInquire={(topic, note) => openContact(topic, note)}
      />

      <ContactModal
        isOpen={contactOpen}
        initialTopic={contactTopic}
        initialNote={contactNote}
        onClose={() => setContactOpen(false)}
      />
    </>
  );
}
