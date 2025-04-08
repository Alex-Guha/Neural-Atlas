/*
Architectures:
    - Essentially an abstraction of the current object-like details.
    - Strictly constructed from existing components, with no subcomponents.
    - TODO Allow for non-sequential component combination in the future
        - i.e. if multiple components want to branch off one.
        - Would require the ability to specify a previous in the architecture

TODO In the future, should look more like: (swappable modules not yet implemented)
architecture_name:
    component_1_name:
        swappable_module_x_in_the_component
        swappable_module_y_in_the_component
    component_2_name
    component_3_name:
        swappable_module_z_in_the_component
    component_4_name

Will need to change the parser to use this format.
*/

export const test = [
    'testText',
    'testEverything',
]