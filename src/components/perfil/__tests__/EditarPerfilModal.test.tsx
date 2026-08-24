import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { EditarPerfilModal } from '../EditarPerfilModal'
import type { UsuarioPerfil } from '@/types'

describe('EditarPerfilModal', () => {
  const mockPerfil: UsuarioPerfil = {
    uid: 'usr-123',
    email: 'cronista@biteatlas.org',
    displayName: 'Itzel Cronista',
    photoURL: 'https://example.com/itzel.jpg',
    rol: 'cronista',
    puntosAntropologicos: 150,
    puntosCuraduria: 20,
    aportesValidados: 3,
    regionesEspecialidad: ['Mesoamérica'],
    insignias: [],
    createdAt: new Date(),
  }

  it('renderiza el formulario con los valores iniciales del perfil', () => {
    render(
      <EditarPerfilModal perfil={mockPerfil} isOpen={true} onClose={vi.fn()} onGuardar={vi.fn()} />
    )

    expect(screen.getByText('Editar Perfil Antropológico')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Itzel Cronista')).toBeInTheDocument()
    expect(screen.getByDisplayValue('https://example.com/itzel.jpg')).toBeInTheDocument()
  })

  it('llama a onGuardar con los datos modificados al enviar el formulario', async () => {
    const onGuardarMock = vi.fn().mockResolvedValue(true)
    const onCloseMock = vi.fn()

    render(
      <EditarPerfilModal
        perfil={mockPerfil}
        isOpen={true}
        onClose={onCloseMock}
        onGuardar={onGuardarMock}
      />
    )

    const nameInput = screen.getByDisplayValue('Itzel Cronista')
    fireEvent.change(nameInput, { target: { value: 'Itzel de Oaxaca' } })

    // Alternar una región adicional
    const andinaBtn = screen.getByRole('button', { name: /Cocina Andina/i })
    fireEvent.click(andinaBtn)

    const submitBtn = screen.getByRole('button', { name: /Guardar Perfil/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(onGuardarMock).toHaveBeenCalledWith({
        displayName: 'Itzel de Oaxaca',
        photoURL: 'https://example.com/itzel.jpg',
        regionesEspecialidad: ['Mesoamérica', 'Cocina Andina'],
      })
      expect(onCloseMock).toHaveBeenCalled()
    })
  })

  it('no renderiza contenido cuando isOpen es false', () => {
    render(
      <EditarPerfilModal perfil={mockPerfil} isOpen={false} onClose={vi.fn()} onGuardar={vi.fn()} />
    )

    expect(screen.queryByText('Editar Perfil Antropológico')).not.toBeInTheDocument()
  })
})
