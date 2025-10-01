import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MuralRecados } from "@/components/house/MuralRecados"
import { ListaAmigos } from "@/components/house/ListaAmigos"
import { Biblioteca } from "@/components/house/biblioteca/Biblioteca"

export function SalaDeEstar() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Sala de Estar
          <span role="img" aria-label="sofa">🛋️</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="mural" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mural">Mural de Recados</TabsTrigger>
            <TabsTrigger value="amigos">Amigos</TabsTrigger>
            <TabsTrigger value="biblioteca">Biblioteca</TabsTrigger>
          </TabsList>
          <TabsContent value="mural">
            <MuralRecados />
          </TabsContent>
          <TabsContent value="amigos">
            <ListaAmigos />
          </TabsContent>
          <TabsContent value="biblioteca">
            <Biblioteca />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}