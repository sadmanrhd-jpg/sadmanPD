import { useEffect, useState } from "react";
import { DESIGN_PROJECTS, PHOTO_ITEMS, type View } from "./data/portfolio";
import type { ContactFormValues } from "./utils/portfolioLogic";
import { Header } from "./components/Header";
import { HomeView } from "./components/HomeView";
import { DesignGallery } from "./components/DesignGallery";
import { DesignCaseStudyView } from "./components/DesignCaseStudyView";
import { PhotoGallery } from "./components/PhotoGallery";
import { PhotoDetailView } from "./components/PhotoDetailView";
import { AboutView } from "./components/AboutView";
import { Footer } from "./components/Footer";
import { ContactModal } from "./components/ContactModal";

type ActiveDetail =
  | { kind: "design"; id: string; returnTo: View }
  | { kind: "photo"; id: string; returnTo: View }
  | null;

export default function App() {
  const [view, setView] = useState<View>("home");
  const [activeDetail, setActiveDetail] = useState<ActiveDetail>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactTopic, setContactTopic] =
    useState<ContactFormValues["topic"]>("Product Design");
  const [contactNote, setContactNote] = useState("");

  const activeDesignStudy =
    activeDetail?.kind === "design"
      ? DESIGN_PROJECTS.find((item) => item.id === activeDetail.id) ?? null
      : null;

  const activePhotoDetail =
    activeDetail?.kind === "photo"
      ? PHOTO_ITEMS.find((item) => item.id === activeDetail.id) ?? null
      : null;

  useEffect(() => {
    document.title = "Sadman — Product Designer & Photographer";
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [view]);

  const handleNavigate = (nextView: View) => {
    setActiveDetail(null);
    setView(nextView);
  };

  const openDetail = (
    kind: "design" | "photo",
    id: string,
    returnTo: View,
  ) => {
    setActiveDetail({ kind, id, returnTo });
  };

  const openContact = (
    topic: ContactFormValues["topic"] = "Product Design",
    note = "",
  ) => {
    setContactTopic(topic);
    setContactNote(note);
    setContactOpen(true);
  };

  const headerActiveView: View = activeDetail ? activeDetail.kind : view;

  return (
    <>
      <div
        data-blurred={contactOpen ? "true" : "false"}
        aria-hidden={contactOpen}
        className={`min-h-screen flex flex-col transition-[filter] duration-200 ${
          contactOpen ? "blur-[6px] pointer-events-none select-none" : ""
        }`}
      >
        <Header
          activeView={headerActiveView}
          onNavigate={handleNavigate}
          onOpenContact={() =>
            openContact(
              headerActiveView === "photo" ? "Street Photography" : "Product Design",
            )
          }
        />

        <div className="flex-1">
          {activeDesignStudy ? (
            <DesignCaseStudyView
              project={activeDesignStudy}
              projects={DESIGN_PROJECTS}
              disableKeyboardNav={contactOpen}
              onBack={() => {
                const target = activeDetail?.returnTo ?? "design";
                setActiveDetail(null);
                setView(target);
              }}
              onSelectProject={(projectId) =>
                setActiveDetail((prev) => ({
                  kind: "design",
                  id: projectId,
                  returnTo: prev?.returnTo ?? "design",
                }))
              }
              onInquire={(topic, note) => openContact(topic, note)}
            />
          ) : activePhotoDetail ? (
            <PhotoDetailView
              photo={activePhotoDetail}
              photos={PHOTO_ITEMS}
              disableKeyboardNav={contactOpen}
              onBack={() => {
                const target = activeDetail?.returnTo ?? "photo";
                setActiveDetail(null);
                setView(target);
              }}
              onSelectPhoto={(photoId) =>
                setActiveDetail((prev) => ({
                  kind: "photo",
                  id: photoId,
                  returnTo: prev?.returnTo ?? "photo",
                }))
              }
              onInquire={(topic, note) => openContact(topic, note)}
            />
          ) : (
            <>
              {view === "home" && (
                <HomeView
                  onNavigate={handleNavigate}
                  onOpenContact={() => openContact("Product Design")}
                  onOpenProject={(kind, id) => openDetail(kind, id, "home")}
                />
              )}
              {view === "design" && (
                <DesignGallery
                  onNavigate={handleNavigate}
                  onOpenDetailedStudy={(projectId) =>
                    openDetail("design", projectId, "design")
                  }
                />
              )}
              {view === "photo" && (
                <PhotoGallery
                  onNavigate={handleNavigate}
                  onOpenPhotoDetail={(photoId) =>
                    openDetail("photo", photoId, "photo")
                  }
                />
              )}
              {view === "about" && (
                <AboutView
                  onNavigate={handleNavigate}
                  onOpenContact={() => openContact("Both")}
                />
              )}
            </>
          )}
        </div>

        <Footer
          onOpenContact={() =>
            openContact(
              headerActiveView === "photo" ? "Street Photography" : "Product Design",
            )
          }
        />
      </div>

      <ContactModal
        isOpen={contactOpen}
        initialTopic={contactTopic}
        initialNote={contactNote}
        onClose={() => setContactOpen(false)}
      />
    </>
  );
}
