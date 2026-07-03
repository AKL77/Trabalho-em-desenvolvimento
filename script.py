from pathlib import Path
from PIL import Image

TILE = 16

# Todos os tiles únicos do jogo, incluindo o personagem (131)
TILE_DICT = {
    0: "0001",
    1: "0002",
    2: "0025",
    3: "0000",
    8: "0105",
    9: "0055",
    131: "0131" # O Personagem
}

PASTA = Path("assets/Tiles")

# O tamanho da imagem será o número de itens x 16px de largura, e 16px de altura
largura = len(TILE_DICT) * TILE
altura = TILE

spritesheet = Image.new("RGBA", (largura, altura))

# Cola cada tile lado a lado na linha 0
for col, (logica, nome) in enumerate(TILE_DICT.items()):
    img = Image.open(PASTA / f"tile_{nome}.png")
    spritesheet.paste(img, (col * TILE, 0))

spritesheet.save("spritesheet.png")
print("Spritesheet criado com sucesso!")