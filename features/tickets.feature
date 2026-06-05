Feature: Piletite ostmise funktsionaalsus

  Scenario: Kasutaja saab alustada piletite ostmist
    Given Kasutaja avab Apollo Kino veebilehe
    When Kasutaja valib avalehelt filmi
    And Vajutab "Vali seanss" nuppu
    Then Kõik seansid peaksid olema nähtavad
    When Kasutaja valib seansi ja vajutab "Osta pileteid" nuppu
    And Valib modaalis "Jätka ilma soodustuseta"
    Then Avaneb pileti ostmise ja kohtade valimise lehekülg
