import { PosetFrom } from "@/app/ui/PosetFrom";
import { Container } from "@mui/material";

export default function Poset({params}:{params:{projectId:string}}) {
    return(<Container>
        <PosetFrom />
    </Container>)

}