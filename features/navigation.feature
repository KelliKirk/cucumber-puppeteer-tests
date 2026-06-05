Feature: Kinokava navigeerimise funktsionaalsus

  Scenario: Kasutaja saab liikuda kinokava lehele
    Given Kasutaja avab Apollo Kino veebilehe
    When Kasutaja vajutab menüüs nupule "Kinokava"
    And Kasutaja ootab lehe laadimist
    Then Kasutaja peaks nägema kinoseansside nimekirja
