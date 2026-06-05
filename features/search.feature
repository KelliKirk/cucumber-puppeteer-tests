Feature: Filmi otsingu funktsionaalsus

  Scenario: Kasutaja saab otsida filmi otsinguvälja kaudu
    Given Kasutaja avab Apollo Kino veebilehe
    When Kasutaja vajutab otsinguikoonile
    And Kasutaja sisestab filmi nime "Minecraft"
    And Vajutab Enter
    Then Otsingutulemused peaksid sisaldama filmi "Minecraft"
