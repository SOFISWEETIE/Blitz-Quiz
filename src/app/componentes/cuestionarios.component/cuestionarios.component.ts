import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { CuestionariosService } from '../../servicios/cuestionarios.service'
import { QRCodeComponent } from 'angularx-qrcode'
import emailjs from '@emailjs/browser'


@Component({
  selector: 'app-cuestionarios',
  standalone: true,
  imports: [CommonModule, FormsModule, QRCodeComponent],
  templateUrl: './cuestionarios.component.html',
  styleUrl: './cuestionarios.component.css'
})
export class CuestionariosComponent implements OnInit {
mostrarInvitar = false
cuestionarioSeleccionado: any | null = null
enlaceInvitacion = ''
emailInvitado = ''
estadoEmail = ''
enviandoEmail = false

  cuestionarios: any[] = []
  creando = false
  editandoId: string | null = null

  formulario = {
    titulo: '',
    descripcion: '',
    preguntas: [] as any[]
  }

  constructor(private service: CuestionariosService) {}

  ngOnInit() {
    this.service.obtenerMisCuestionarios().subscribe(data => {
      this.cuestionarios = data
    })
  }

  nuevo() {
    this.creando = true
    this.editandoId = null
    this.formulario = { titulo: '', descripcion: '', preguntas: [] }
  }

  editar(c: any) {
    this.creando = true
    this.editandoId = c.id
    this.formulario = JSON.parse(JSON.stringify(c))
  }

  anadirPregunta() {
  this.formulario.preguntas.push({
    enunciado: '',
    opciones: ['', '', '', ''],
    correcta: 0
  })
}
trackByIndex(index: number) {
  return index
}


  eliminarPregunta(i: number) {
    this.formulario.preguntas.splice(i, 1)
  }

  async guardar() {
    if (this.editandoId) {
      await this.service.actualizarCuestionario(this.editandoId, this.formulario)
    } else {
      await this.service.crearCuestionario(this.formulario)
    }
    this.creando = false
    this.editandoId = null
  }

  async eliminar(id: string) {
    if (confirm('¿Eliminar cuestionario?')) {
      await this.service.eliminarCuestionario(id)
    }
  }

  cancelar() {
    this.creando = false
    this.editandoId = null
  }

  abrirInvitar(c: any) {
  this.cuestionarioSeleccionado = c
  this.enlaceInvitacion = `https://sas-tfg.web.app/jugar/${c.id}`
  this.mostrarInvitar = true
}

cerrarInvitar() {
  this.mostrarInvitar = false
  this.cuestionarioSeleccionado = null
  this.enlaceInvitacion = ''
}


invitarPorEmail() {
  const subject = encodeURIComponent('Te invito a jugar mi cuestionario')
  const body = encodeURIComponent(
    `¡Vamos a jugar!\n\nCuestionario: ${this.cuestionarioSeleccionado?.titulo}\nEnlace: ${this.enlaceInvitacion}`
  )
  location.href = `mailto:?subject=${subject}&body=${body}`
}

async copiarEnlace() {
  try {
    await navigator.clipboard.writeText(this.enlaceInvitacion)
    alert('Enlace copiado')
  } catch {
    alert(this.enlaceInvitacion)
  }
}

invitarPorQR() {
  alert('Siguiente paso: generar QR con este enlace:\n' + this.enlaceInvitacion)
}
async enviarInvitacionEmail() {
  const email = (this.emailInvitado || '').trim()

  if (!email) {
    this.estadoEmail = 'Introduce un email válido'
    return
  }

  if (!this.cuestionarioSeleccionado) {
    this.estadoEmail = 'No hay cuestionario seleccionado'
    return
  }

  this.enviandoEmail = true
  this.estadoEmail = 'Enviando invitación...'

  const params = {
    to_email: email,
    from_alias: 'BlitzQuiz',
    quiz_title: this.cuestionarioSeleccionado.titulo || '',
    quiz_desc: this.cuestionarioSeleccionado.descripcion || '',
    invite_link: this.enlaceInvitacion
  }

  try {
    await emailjs.send(
      'service_pjljw5e',
      'template_n55o0o7',
      params,
      { publicKey: 'iNwhsGOY8JrtuYdJ-' }
    )

    this.estadoEmail = 'Invitación enviada ✅'
    this.emailInvitado = ''
  } catch (error) {
    console.error(error)
    this.estadoEmail = 'Error enviando el email ❌'
  } finally {
    this.enviandoEmail = false
  }
}

}