import Header from "../components/ui/Header";


const PAGE_TITLE: string = "Welcome to the Test Application"

export default function HomePage() {
  
    return (
      <>
        <Header 
        variant="h1"
        sx={{textAlign: "center", mt: 10}} 
        title={PAGE_TITLE} />
      </>
    )
  }
  
  